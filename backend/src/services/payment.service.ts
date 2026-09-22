import crypto from 'crypto';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { memoryDonations, DonationRecord } from './store';

export interface CreateOrderParams {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  name?: string | null;
  message?: string | null;
  isAnonymous?: boolean;
}

export interface CreateOrderResult {
  order_id: string;
  orderId: string;
  amount: number;
  currency: string;
  key_id: string;
  keyId: string;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  message: string;
  donation?: {
    amount: number;
    name: string | null;
    message: string | null;
  };
}

export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const { amount, currency = 'INR', receipt, name, message, isAnonymous } = params;

  // Call Razorpay API: POST https://api.razorpay.com/v1/orders
  const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount),
      currency: currency.toUpperCase(),
      receipt: receipt || `receipt_${Date.now()}`,
    }),
  });

  const orderData = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      const err = new Error('Razorpay authentication failed');
      (err as any).statusCode = 401;
      throw err;
    }
    const err = new Error(orderData?.error?.description || 'Razorpay order creation failed');
    (err as any).statusCode = response.status;
    (err as any).error = orderData?.error;
    throw err;
  }

  const orderId = orderData.id;
  const orderAmount = Number(orderData.amount);
  const orderCurrency = orderData.currency;

  const record: DonationRecord = {
    id: `don_${Date.now()}`,
    name: name || null,
    message: message || null,
    amount: orderAmount,
    currency: orderCurrency,
    razorpay_order_id: orderId,
    status: 'created',
    is_anonymous: Boolean(isAnonymous),
    created_at: new Date().toISOString(),
  };

  // Persist to in-memory fallback store
  memoryDonations.unshift(record);

  // If Supabase is available, persist to database
  if (supabase) {
    try {
      const { error: insertError } = await supabase.from('donations').insert({
        name: record.name,
        message: record.message,
        amount: record.amount,
        currency: record.currency,
        razorpay_order_id: record.razorpay_order_id,
        status: record.status,
        is_anonymous: record.is_anonymous,
      });

      if (insertError) {
        console.warn('Could not insert donation into Supabase:', insertError);
      } else {
        console.log(`Donation record for order ${orderId} created in Supabase.`);
      }
    } catch (err) {
      console.warn('Could not write to Supabase (continuing with in-memory):', err);
    }
  }

  return {
    order_id: orderId,
    orderId: orderId,
    amount: orderAmount,
    currency: orderCurrency,
    key_id: env.RAZORPAY_KEY_ID,
    keyId: env.RAZORPAY_KEY_ID,
  };
}

export function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  // Verify HMAC-SHA256 signature
  const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  // Update in-memory record
  const inMemory = memoryDonations.find((d) => d.razorpay_order_id === razorpay_order_id);
  if (inMemory) {
    inMemory.razorpay_payment_id = razorpay_payment_id;
    inMemory.status = 'success';
  }

  let donationData = inMemory
    ? {
        amount: inMemory.amount,
        name: inMemory.name,
        message: inMemory.message,
      }
    : undefined;

  // Update Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .update({
          razorpay_payment_id: razorpay_payment_id,
          status: 'success',
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .select('amount, name, message')
        .single();

      if (!error && data) {
        donationData = {
          amount: data.amount,
          name: data.name,
          message: data.message,
        };
        console.log(`Donation ${razorpay_order_id} marked success in Supabase.`);
      } else if (error) {
        console.warn('Supabase update warning:', error);
      }
    } catch (err) {
      console.warn('Could not update Supabase (using in-memory record):', err);
    }
  }

  return {
    verified: true,
    message: 'Payment verified successfully',
    donation: donationData,
  };
}

export async function handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    console.warn('RAZORPAY_WEBHOOK_SECRET not configured, skipping webhook verification');
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid webhook signature');
  }

  const event = JSON.parse(rawBody.toString());

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return;

    const inMemory = memoryDonations.find((d) => d.razorpay_order_id === payment.order_id);
    if (inMemory) {
      inMemory.razorpay_payment_id = payment.id;
      inMemory.status = 'success';
    }

    if (supabase) {
      try {
        await supabase
          .from('donations')
          .update({
            razorpay_payment_id: payment.id,
            status: 'success',
          })
          .eq('razorpay_order_id', payment.order_id)
          .neq('status', 'success');
      } catch (err) {
        console.warn('Webhook: failed to update Supabase:', err);
      }
    }
  } else if (event.event === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return;

    const inMemory = memoryDonations.find((d) => d.razorpay_order_id === payment.order_id);
    if (inMemory && inMemory.status !== 'success') {
      inMemory.status = 'failed';
    }

    if (supabase) {
      try {
        await supabase
          .from('donations')
          .update({ status: 'failed' })
          .eq('razorpay_order_id', payment.order_id)
          .neq('status', 'success');
      } catch (err) {
        console.warn('Webhook: failed to update Supabase:', err);
      }
    }
  }
}

import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { sanitizeName, sanitizeMessage } from '../utils/validation';

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { amount, currency, receipt, name, message, isAnonymous } = req.body;

    // Validate amount
    if (amount === undefined || amount === null || amount === '') {
      res.status(400).json({ success: false, message: 'Amount is required' });
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || !isFinite(numAmount)) {
      res.status(400).json({ success: false, message: 'Amount must be a valid number' });
      return;
    }

    // Minimum amount: 100 paise (₹1)
    if (numAmount < 100) {
      res.status(400).json({
        success: false,
        message: 'Amount must be at least 100 paise (₹1)',
      });
      return;
    }

    const sanitizedName = sanitizeName(name);
    const sanitizedMessage = sanitizeMessage(message);

    const result = await paymentService.createOrder({
      amount: Math.round(numAmount),
      currency: typeof currency === 'string' ? currency : 'INR',
      receipt: typeof receipt === 'string' ? receipt : undefined,
      name: sanitizedName,
      message: sanitizedMessage,
      isAnonymous: Boolean(isAnonymous),
    });

    // Return both standard schema { order_id, amount, currency } and wrapper data
    res.status(200).json({
      success: true,
      order_id: result.order_id,
      orderId: result.order_id,
      amount: result.amount,
      currency: result.currency,
      key_id: result.key_id,
      keyId: result.keyId,
      data: result,
    });
  } catch (error: any) {
    console.error('Create order error:', error);

    // Handle authentication failures (Razorpay bad credentials)
    const errorMsg = String(error?.message || '').toLowerCase();
    const isAuthError =
      error?.statusCode === 401 ||
      error?.status === 401 ||
      errorMsg.includes('auth') ||
      error?.error?.code === 'BAD_REQUEST_ERROR' && String(error?.error?.description).toLowerCase().includes('auth');

    if (isAuthError) {
      res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed. Please verify your credentials.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error?.error?.description || error?.message || 'Unable to create payment order',
    });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const order_id = req.body.razorpay_order_id || req.body.order_id;
    const payment_id = req.body.razorpay_payment_id || req.body.payment_id;
    const signature = req.body.razorpay_signature || req.body.signature;

    // Validate missing fields -> return 400
    if (!order_id || !payment_id || !signature) {
      res.status(400).json({
        success: false,
        message: 'Missing fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
      });
      return;
    }

    const result = await paymentService.verifyPayment({
      razorpay_order_id: String(order_id),
      razorpay_payment_id: String(payment_id),
      razorpay_signature: String(signature),
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: result,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
    console.error('Verify payment error:', error);

    if (errorMessage === 'Invalid payment signature') {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed: signature mismatch',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: errorMessage || 'Payment verification failed',
    });
  }
}

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
      res.status(400).json({ success: false, message: 'Missing signature' });
      return;
    }

    await paymentService.handleWebhookEvent(req.body as Buffer, signature);
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);

    if (error instanceof Error && error.message === 'Invalid webhook signature') {
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
}

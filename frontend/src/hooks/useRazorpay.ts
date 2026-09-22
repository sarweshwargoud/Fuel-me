import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import type { PaymentState } from '../types';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface UseRazorpayReturn {
  initiatePayment: (params: {
    amount: number;
    name: string;
    message: string;
    isAnonymous: boolean;
  }) => Promise<void>;
  paymentState: PaymentState;
  errorMessage: string | null;
  resetState: () => void;
}

export function useRazorpay(): UseRazorpayReturn {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetState = useCallback(() => {
    setPaymentState('idle');
    setErrorMessage(null);
  }, []);

  const initiatePayment = useCallback(
    async (params: {
      amount: number;
      name: string;
      message: string;
      isAnonymous: boolean;
    }) => {
      try {
        setPaymentState('creating');
        setErrorMessage(null);

        // Ensure Razorpay checkout script is loaded
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Failed to load Razorpay payment gateway. Please check your network connection.');
        }

        // Amount in paise (minimum 100 paise = ₹1)
        const amountInPaise = Math.round(params.amount * 100);

        // Step 1: Call create-order endpoint
        const orderResponse = await api.createOrder({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          name: params.name || undefined,
          message: params.message || undefined,
          isAnonymous: params.isAnonymous,
        });

        if (!orderResponse.success) {
          throw new Error(orderResponse.message || 'Failed to create payment order');
        }

        const orderId =
          orderResponse.order_id ||
          orderResponse.orderId ||
          orderResponse.data?.order_id ||
          orderResponse.data?.orderId;

        if (!orderId) {
          throw new Error('Invalid order response from server');
        }

        const keyId =
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          orderResponse.key_id ||
          orderResponse.keyId ||
          orderResponse.data?.key_id ||
          orderResponse.data?.keyId;

        setPaymentState('processing');

        // Step 2: Open Razorpay checkout modal
        const rzp = new window.Razorpay({
          key: keyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Buy Me a Coffee',
          description: `Support developer projects — ₹${params.amount}`,
          order_id: orderId,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              setPaymentState('verifying');

              // Step 3: Send payment details to verify endpoint
              const verifyResponse = await api.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.success) {
                setPaymentState('success');
                navigate('/thank-you', {
                  state: {
                    amount: params.amount,
                    name: params.name,
                    message: params.message,
                  },
                });
              } else {
                throw new Error(verifyResponse.message || 'Payment verification failed');
              }
            } catch (err: any) {
              setPaymentState('failed');
              const msg = err instanceof Error ? err.message : 'Payment verification failed';
              setErrorMessage(msg);
              navigate('/payment-failed');
            }
          },
          prefill: {
            name: params.name || undefined,
          },
          theme: {
            color: '#E8590C',
          },
          modal: {
            ondismiss: () => {
              setPaymentState('cancelled');
              setErrorMessage('Payment cancelled');
              setTimeout(() => {
                setPaymentState('idle');
                setErrorMessage(null);
              }, 4000);
            },
          },
        });

        // Handle payment failure event
        rzp.on('payment.failed', (failResponse: any) => {
          setPaymentState('failed');
          const description =
            failResponse?.error?.description ||
            failResponse?.error?.reason ||
            'Payment failed. Please try again.';
          setErrorMessage(description);
          navigate('/payment-failed');
        });

        rzp.open();
      } catch (error: any) {
        const message = error instanceof Error ? error.message : 'Payment initiation failed';
        setErrorMessage(message);
        setPaymentState('failed');
      }
    },
    [navigate]
  );

  return { initiatePayment, paymentState, errorMessage, resetState };
}

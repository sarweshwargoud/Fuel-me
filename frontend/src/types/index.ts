// ============================================
// Shared types for Buy Me a Coffee
// ============================================

export interface CreateOrderRequest {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  name?: string;
  message?: string;
  isAnonymous?: boolean;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  key_id?: string;
  keyId?: string;
  data?: {
    order_id?: string;
    orderId?: string;
    amount?: number;
    currency?: string;
    key_id?: string;
    keyId?: string;
  };
  message?: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    verified?: boolean;
    donation?: {
      amount: number;
      name: string | null;
      message: string | null;
    };
  };
}

export interface RecentDonation {
  name: string;
  amount: number;
  message: string | null;
  created_at: string;
}

export interface RecentDonationsResponse {
  success: boolean;
  data: RecentDonation[];
}

export type PaymentState =
  | 'idle'
  | 'creating'
  | 'processing'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'cancelled';

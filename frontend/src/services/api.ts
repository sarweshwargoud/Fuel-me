import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  RecentDonationsResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>('/api/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  return request<VerifyPaymentResponse>('/api/verify-payment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getRecentDonations(): Promise<RecentDonationsResponse> {
  return request<RecentDonationsResponse>('/api/donations/recent');
}

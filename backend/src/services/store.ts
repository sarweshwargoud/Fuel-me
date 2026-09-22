export interface DonationRecord {
  id: string;
  name: string | null;
  message: string | null;
  amount: number; // in paise
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  status: 'created' | 'success' | 'failed';
  is_anonymous: boolean;
  created_at: string;
}

// In-memory fallback store when external database (Supabase) is not configured
export const memoryDonations: DonationRecord[] = [];

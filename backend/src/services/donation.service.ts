import { supabase } from '../config/supabase';
import { memoryDonations } from './store';

interface PublicDonation {
  name: string;
  amount: number;
  message: string | null;
  created_at: string;
}

export async function getRecentDonations(limit: number = 20): Promise<PublicDonation[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('name, amount, message, is_anonymous, created_at')
        .eq('status', 'success')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data.map((donation) => ({
          name: donation.is_anonymous ? 'Anonymous' : donation.name || 'Anonymous',
          amount: donation.amount,
          message: donation.message,
          created_at: donation.created_at,
        }));
      }
    } catch (err) {
      console.warn('Failed to query Supabase donations, falling back to memory:', err);
    }
  }

  // Fallback to in-memory store
  return memoryDonations
    .filter((d) => d.status === 'success')
    .slice(0, limit)
    .map((donation) => ({
      name: donation.is_anonymous ? 'Anonymous' : donation.name || 'Anonymous',
      amount: donation.amount,
      message: donation.message,
      created_at: donation.created_at,
    }));
}

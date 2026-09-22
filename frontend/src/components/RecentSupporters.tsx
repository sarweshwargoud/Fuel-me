import { useEffect, useState } from 'react';
import { Coffee, Heart } from 'lucide-react';
import { getRecentDonations } from '../services/api';
import type { RecentDonation } from '../types';

export function RecentSupporters() {
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await getRecentDonations();
        if (response.success) {
          setDonations(response.data);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);

  // Don't render the section if there's an error or no data
  if (error) return null;

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
        Recent Supporters
      </h2>
      <p className="text-sm text-text-muted text-center mb-8">
        <Heart className="w-4 h-4 inline text-red-400" /> Thank you to everyone who supports!
      </p>

      {loading ? (
        /* Skeleton loading */
        <div className="max-w-md mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-bg-card rounded-2xl p-5 border border-warm-100 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warm-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-warm-200 rounded w-24" />
                  <div className="h-3 bg-warm-100 rounded w-40" />
                </div>
                <div className="h-5 bg-warm-200 rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        /* Empty state */
        <div className="text-center py-8">
          <Coffee className="w-10 h-10 text-warm-300 mx-auto mb-3" />
          <p className="text-sm text-text-muted">
            Be the first to buy me a coffee! ☕
          </p>
        </div>
      ) : (
        /* Supporter list */
        <div className="max-w-md mx-auto space-y-3">
          {donations.map((donation, index) => (
            <div
              key={index}
              className="
                bg-bg-card rounded-2xl p-5 border border-warm-100
                shadow-sm hover:shadow-md transition-shadow duration-300
              "
            >
              <div className="flex items-start gap-3">
                <div className="
                  flex items-center justify-center w-10 h-10 rounded-full shrink-0
                  bg-primary-100 text-primary-600
                ">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm text-text-primary truncate">
                      {donation.name}
                    </span>
                    <span className="text-sm font-bold text-primary-600 shrink-0">
                      ₹{donation.amount / 100}
                    </span>
                  </div>
                  {donation.message && (
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                      "{donation.message}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

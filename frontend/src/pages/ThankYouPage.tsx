import { useLocation, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Coffee, ArrowLeft, Share2, Heart } from 'lucide-react';

interface LocationState {
  amount?: number;
  name?: string;
  message?: string;
}

export function ThankYouPage() {
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const { amount, message } = state;

  function handleShare() {
    const text = `I just supported Sarweshwar's projects with a coffee! ☕ Check it out:`;
    const url = window.location.origin;

    if (navigator.share) {
      navigator.share({ title: 'Buy Me a Coffee', text, url }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {});
    }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto">
          {/* Animated coffee icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary-100 mb-8">
            <Coffee className="w-12 h-12 text-primary-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Thank You! <Heart className="w-8 h-8 inline text-red-500" />
          </h1>

          <p className="text-lg text-text-secondary mb-6">
            Your coffee is officially brewing. ☕
          </p>

          {/* Amount display */}
          {amount && (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-50 border border-primary-100 mb-4">
              <span className="text-2xl font-bold text-primary-700">₹{amount}</span>
            </div>
          )}

          {/* Message display */}
          {message && (
            <p className="text-sm text-text-secondary italic mb-6 px-4">
              "{message}"
            </p>
          )}

          <p className="text-sm text-text-muted mb-8">
            Your support helps me continue building and learning. 🙏
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-warm-100 text-text-primary font-semibold text-sm
                hover:bg-warm-200 transition-colors duration-200
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <button
              onClick={handleShare}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-primary-600 text-white font-semibold text-sm cursor-pointer
                hover:bg-primary-700 transition-colors duration-200
              "
            >
              <Share2 className="w-4 h-4" />
              Share My Support
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

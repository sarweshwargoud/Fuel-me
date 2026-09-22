import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export function PaymentFailedPage() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto">
          {/* Warning icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-warm-100 mb-8">
            <AlertTriangle className="w-10 h-10 text-warm-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Payment Not Completed
          </h1>

          <p className="text-text-secondary mb-8 leading-relaxed">
            Something went wrong or the payment was cancelled.
            <br />
            No worries — you were not charged.
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

            <Link
              to="/"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-primary-600 text-white font-semibold text-sm
                hover:bg-primary-700 transition-colors duration-200
              "
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Coffee, Loader2 } from 'lucide-react';
import type { PaymentState } from '../types';

interface PaymentButtonProps {
  amount: number | null;
  paymentState: PaymentState;
  onClick: () => void;
}

const STATE_LABELS: Record<string, string> = {
  creating: 'Creating secure payment...',
  processing: 'Opening payment gateway...',
  verifying: 'Verifying payment...',
};

export function PaymentButton({ amount, paymentState, onClick }: PaymentButtonProps) {
  const isLoading = ['creating', 'processing', 'verifying'].includes(paymentState);
  const isDisabled = !amount || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full py-4 px-6 rounded-2xl text-base font-bold
        flex items-center justify-center gap-3
        transition-all duration-300 cursor-pointer
        ${
          isDisabled
            ? 'bg-warm-200 text-text-muted cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200 active:scale-[0.98]'
        }
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{STATE_LABELS[paymentState] || 'Processing...'}</span>
        </>
      ) : (
        <>
          <Coffee className="w-5 h-5" />
          <span>
            Buy Me a Coffee{amount ? ` — ₹${amount}` : ''}
          </span>
        </>
      )}
    </button>
  );
}

import { useState } from 'react';
import { Copy, Check, ExternalLink, Smartphone, Sparkles } from 'lucide-react';

interface UpiQrViewProps {
  amount: number | null;
}

const UPI_ID = '7661831324-2@axl';
const PAYEE_NAME = 'Buddolla Sarweshwar';

export function UpiQrView({ amount }: UpiQrViewProps) {
  const [copied, setCopied] = useState(false);

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}${amount ? `&am=${amount}` : ''}&cu=INR&tn=${encodeURIComponent('Coffee Support')}`;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* QR Code Container */}
      <div className="relative mx-auto max-w-[280px] bg-white rounded-2xl p-4 shadow-md border border-warm-200 flex flex-col items-center">
        {/* PhonePe & UPI Badge */}
        <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PhonePe / Any UPI App</span>
        </div>

        {/* QR Image */}
        <div className="w-full aspect-[1/1] overflow-hidden rounded-xl bg-white border border-warm-100 flex items-center justify-center p-1">
          <img
            src="/upi-qr.jpg"
            alt="PhonePe UPI QR Code for Buddolla Sarweshwar"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Payee Info */}
        <div className="mt-3 text-center w-full">
          <p className="text-xs text-text-muted">Payee Name</p>
          <p className="font-bold text-text-primary text-sm tracking-tight">{PAYEE_NAME}</p>
          {amount && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
              <span>Amount: ₹{amount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Copy UPI ID Field */}
      <div className="bg-warm-50 rounded-xl p-3 border border-warm-200">
        <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
          <span>UPI ID</span>
          <span>Tap to copy</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <code className="font-mono text-sm font-semibold text-text-primary truncate">
            {UPI_ID}
          </code>
          <button
            type="button"
            onClick={copyUpiId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-warm-200 hover:border-primary-400 text-xs font-medium text-text-primary hover:text-primary-600 transition-colors shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Direct Pay Button */}
      <a
        href={upiDeepLink}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer"
      >
        <Smartphone className="w-4 h-4" />
        <span>Pay via UPI App {amount ? `(₹${amount})` : ''}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>

      {/* Accepted apps tags */}
      <div className="text-center pt-1">
        <p className="text-xs text-text-muted mb-2">Accepted with all UPI Apps</p>
        <div className="flex flex-wrap justify-center gap-1.5 text-[11px] font-medium text-text-secondary">
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">PhonePe</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">Google Pay</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">Paytm</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">BHIM</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">Cred UPI</span>
        </div>
      </div>
    </div>
  );
}

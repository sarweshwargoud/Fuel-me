import { useState } from 'react';
import { Copy, Check, QrCode, Smartphone, Sparkles, ExternalLink } from 'lucide-react';

interface UpiQrViewProps {
  amount: number | null;
  name?: string;
  message?: string;
}

const UPI_ID = '7661831324-2@axl';
const PAYEE_NAME = 'Buddolla Sarweshwar';

export function UpiQrView({ amount, name, message }: UpiQrViewProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const note = message?.trim()
    ? `Coffee from ${name?.trim() || 'Supporter'}: ${message.trim()}`.slice(0, 45)
    : name?.trim()
    ? `Coffee from ${name.trim()}`.slice(0, 45)
    : 'Coffee Support';

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}${amount ? `&am=${amount}` : ''}&cu=INR&tn=${encodeURIComponent(note)}`;

  return (
    <div className="space-y-4 animate-fade-in pt-1">
      {/* Top action buttons: Copy UPI ID & Show/Hide QR (on top of button) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Button 1: Copy UPI ID */}
        <button
          type="button"
          onClick={copyUpiId}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
            copied
              ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md'
              : 'bg-white border-2 border-warm-200 text-text-primary hover:border-primary-400 hover:text-primary-600 hover:bg-warm-50'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 shrink-0 text-white" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 shrink-0" />
              <span>Copy UPI ID</span>
            </>
          )}
        </button>

        {/* Button 2: Show / Hide QR */}
        <button
          type="button"
          onClick={() => setShowQr((prev) => !prev)}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
            showQr
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-purple-50 border-2 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300'
          }`}
        >
          <QrCode className="w-4 h-4 shrink-0" />
          <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
        </button>
      </div>

      {/* Copied feedback banner */}
      {copied && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-1.5 animate-fade-in text-center font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>UPI ID ({UPI_ID}) copied! Paste it in your UPI app to pay.</span>
        </div>
      )}

      {/* UPI ID preview (always visible even when QR code is hidden) */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <span>UPI ID:</span>
        <code className="font-mono font-semibold text-text-secondary bg-warm-100 px-2.5 py-0.5 rounded-lg border border-warm-200">
          {UPI_ID}
        </code>
      </div>

      {/* QR Code Container on top of button (shown when showQr is true) */}
      {showQr && (
        <div className="relative mx-auto max-w-[280px] bg-white rounded-2xl p-4 shadow-md border border-warm-200 flex flex-col items-center animate-fade-in">
          {/* PhonePe & UPI Badge */}
          <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan with Any UPI App</span>
          </div>

          {/* QR Image */}
          <div className="w-full aspect-square overflow-hidden rounded-xl bg-white border border-warm-100 flex items-center justify-center p-1">
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

          {/* Tap to copy UPI ID pill */}
          <div
            onClick={copyUpiId}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-warm-50 border border-warm-200 mt-3 cursor-pointer hover:bg-warm-100/80 active:scale-[0.99] transition-all"
            title="Click to copy UPI ID"
          >
            <div className="text-left min-w-0 pr-2">
              <p className="text-[10px] uppercase font-semibold text-text-muted">UPI ID</p>
              <code className="font-mono text-xs font-bold text-text-primary truncate block">
                {UPI_ID}
              </code>
            </div>
            <span className="text-[11px] font-semibold text-primary-600">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </div>
        </div>
      )}

      {/* The main Pay with UPI Button at the bottom (ALWAYS visible even if QR is hidden) */}
      <a
        href={upiDeepLink}
        className="w-full py-4 px-6 rounded-2xl text-base font-bold flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
      >
        <Smartphone className="w-5 h-5" />
        <span>Pay with UPI App{amount ? ` (₹${amount})` : ''}</span>
        <ExternalLink className="w-4 h-4 opacity-80" />
      </a>

      {/* Accepted apps badges */}
      <div className="text-center pt-1">
        <p className="text-xs text-text-muted mb-2">Accepted with all UPI Apps</p>
        <div className="flex flex-wrap justify-center gap-1.5 text-[11px] font-medium text-text-secondary">
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">PhonePe</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">Google Pay</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">Paytm</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">BHIM</span>
          <span className="px-2 py-0.5 rounded-md bg-warm-100 border border-warm-200">Cred</span>
        </div>
      </div>
    </div>
  );
}

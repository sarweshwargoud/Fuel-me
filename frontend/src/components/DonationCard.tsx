import { useState } from 'react';
import { AmountSelector } from './AmountSelector';
import { SupporterForm } from './SupporterForm';
import { PaymentButton } from './PaymentButton';
import { useRazorpay } from '../hooks/useRazorpay';
import { AlertCircle, X } from 'lucide-react';

export function DonationCard() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { initiatePayment, paymentState, errorMessage, resetState } = useRazorpay();

  const effectiveAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;

  function handlePresetSelect(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount('');
    setValidationError(null);
  }

  function handleCustomAmountChange(value: string) {
    setCustomAmount(value);
    setSelectedAmount(null);
    setValidationError(null);

    if (value) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) {
        setValidationError('Minimum amount is ₹1');
      } else if (num > 1000) {
        setValidationError('Maximum amount is ₹1,000');
      }
    }
  }

  function validateAndPay() {
    if (!effectiveAmount) {
      setValidationError('Please select or enter an amount');
      return;
    }

    if (effectiveAmount < 1 || effectiveAmount > 1000) {
      setValidationError('Amount must be between ₹1 and ₹1,000');
      return;
    }

    if (!Number.isInteger(effectiveAmount)) {
      setValidationError('Amount must be a whole number');
      return;
    }

    setValidationError(null);
    initiatePayment({
      amount: effectiveAmount,
      name: name.trim(),
      message: message.trim(),
      isAnonymous,
    });
  }

  return (
    <section className="max-w-md mx-auto" id="donate">
      <div className="bg-bg-card rounded-3xl shadow-lg shadow-warm-200/50 border border-warm-100 p-6 md:p-8 space-y-6">
        {/* Error banner */}
        {errorMessage && paymentState === 'failed' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
            <button
              onClick={resetState}
              className="text-red-400 hover:text-red-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Cancelled banner */}
        {paymentState === 'cancelled' && (
          <div className="p-4 rounded-xl bg-warm-100 border border-warm-200">
            <p className="text-sm text-text-secondary text-center">
              Payment was cancelled. No worries — try again when you're ready!
            </p>
          </div>
        )}

        <AmountSelector
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          onSelectPreset={handlePresetSelect}
          onCustomAmountChange={handleCustomAmountChange}
          validationError={validationError}
        />

        <div className="border-t border-warm-100" />

        <SupporterForm
          name={name}
          message={message}
          isAnonymous={isAnonymous}
          onNameChange={setName}
          onMessageChange={setMessage}
          onAnonymousChange={setIsAnonymous}
        />

        <PaymentButton
          amount={effectiveAmount}
          paymentState={paymentState}
          onClick={validateAndPay}
        />
      </div>
    </section>
  );
}

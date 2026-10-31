import { useState } from 'react';
import { AmountSelector } from './AmountSelector';
import { SupporterForm } from './SupporterForm';
import { UpiQrView } from './UpiQrView';

export function DonationCard() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  return (
    <section className="max-w-md mx-auto" id="donate">
      <div className="bg-bg-card rounded-3xl shadow-lg shadow-warm-200/50 border border-warm-100 p-6 md:p-8 space-y-6">
        {/* Amount Selector */}
        <AmountSelector
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          onSelectPreset={handlePresetSelect}
          onCustomAmountChange={handleCustomAmountChange}
          validationError={validationError}
        />

        <div className="border-t border-warm-100" />

        {/* Supporter Details Form */}
        <SupporterForm
          name={name}
          message={message}
          isAnonymous={isAnonymous}
          onNameChange={setName}
          onMessageChange={setMessage}
          onAnonymousChange={setIsAnonymous}
        />

        {/* Copy UPI ID and Show QR displayed on top of the button */}
        <UpiQrView
          amount={effectiveAmount}
          name={name}
          message={message}
        />
      </div>
    </section>
  );
}

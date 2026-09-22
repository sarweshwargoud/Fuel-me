interface AmountSelectorProps {
  selectedAmount: number | null;
  customAmount: string;
  onSelectPreset: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  validationError: string | null;
}

const PRESET_AMOUNTS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

export function AmountSelector({
  selectedAmount,
  customAmount,
  onSelectPreset,
  onCustomAmountChange,
  validationError,
}: AmountSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-3">
        Choose an amount
      </label>

      {/* Preset amount grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onSelectPreset(amount)}
            className={`
              relative py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200
              cursor-pointer border-2
              ${
                selectedAmount === amount && customAmount === ''
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200 scale-[1.02]'
                  : 'bg-white text-text-primary border-warm-200 hover:border-primary-300 hover:bg-primary-50'
              }
            `}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
          ₹
        </span>
        <input
          type="number"
          min={1}
          max={1000}
          value={customAmount}
          onChange={(e) => onCustomAmountChange(e.target.value)}
          placeholder="Enter custom amount (₹1 – ₹1,000)"
          className={`
            w-full pl-8 pr-4 py-3 rounded-xl border-2 text-sm font-medium
            transition-all duration-200 bg-white
            placeholder:text-text-muted
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
            ${validationError ? 'border-red-400' : 'border-warm-200'}
          `}
        />
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="mt-2 text-xs text-red-500 font-medium">{validationError}</p>
      )}
    </div>
  );
}

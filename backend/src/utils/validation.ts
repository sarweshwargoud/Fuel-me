const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1000;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 200;

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateAmount(amount: unknown): ValidationResult {
  if (amount === undefined || amount === null) {
    return { valid: false, message: 'Amount is required' };
  }

  const numAmount = Number(amount);

  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return { valid: false, message: 'Amount must be a valid number' };
  }

  if (numAmount < MIN_AMOUNT) {
    return { valid: false, message: `Minimum amount is ₹${MIN_AMOUNT}` };
  }

  if (numAmount > MAX_AMOUNT) {
    return { valid: false, message: `Maximum amount is ₹${MAX_AMOUNT}` };
  }

  // Ensure amount is a whole number (no fractional rupees)
  if (!Number.isInteger(numAmount)) {
    return { valid: false, message: 'Amount must be a whole number' };
  }

  return { valid: true };
}

export function sanitizeName(name: unknown): string | null {
  if (!name || typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (trimmed.length === 0) return null;
  return trimmed.substring(0, MAX_NAME_LENGTH);
}

export function sanitizeMessage(message: unknown): string | null {
  if (!message || typeof message !== 'string') return null;
  const trimmed = message.trim();
  if (trimmed.length === 0) return null;
  return trimmed.substring(0, MAX_MESSAGE_LENGTH);
}

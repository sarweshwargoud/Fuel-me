import rateLimit from 'express-rate-limit';

// Rate limiter for payment endpoints — 10 requests per minute per IP
export const paymentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many payment requests. Please try again in a minute.',
  },
});

// Rate limiter for general API endpoints — 60 requests per minute per IP
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again shortly.',
  },
});

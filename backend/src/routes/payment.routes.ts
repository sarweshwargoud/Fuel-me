import { Router } from 'express';
import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import { paymentRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Rate limit payment endpoints
router.use(paymentRateLimiter);

// Create a new Razorpay order: POST /api/create-order or POST /api/payment/create-order
router.post('/create-order', paymentController.createOrder);

// Verify payment after Razorpay checkout: POST /api/verify-payment or POST /api/payment/verify
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/verify', paymentController.verifyPayment);

// Razorpay webhook — uses raw body for signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

export default router;

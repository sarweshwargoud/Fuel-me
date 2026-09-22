import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import paymentRoutes from './routes/payment.routes';
import donationRoutes from './routes/donation.routes';

const app = express();

// Security headers
app.use(helmet());

// CORS — allow frontend origin
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Parse JSON for all routes except webhook (which needs raw body)
app.use((req, res, next) => {
  if (req.path === '/api/payment/webhook' || req.path === '/api/webhook') {
    // Skip JSON parsing for webhook — handled by express.raw() in the route
    next();
  } else {
    express.json({ limit: '1mb' })(req, res, next);
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Mount payment routes under both /api and /api/payment for maximum compatibility
app.use('/api', paymentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/donations', donationRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`☕ Server running on port ${env.PORT}`);
  console.log(`   Health: http://localhost:${env.PORT}/api/health`);
});

export default app;

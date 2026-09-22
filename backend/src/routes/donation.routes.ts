import { Router } from 'express';
import * as donationController from '../controllers/donation.controller';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiRateLimiter);

// Get recent successful donations for public display
router.get('/recent', donationController.getRecentDonations);

export default router;

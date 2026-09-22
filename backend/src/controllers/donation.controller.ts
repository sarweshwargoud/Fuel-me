import { Request, Response } from 'express';
import * as donationService from '../services/donation.service';

export async function getRecentDonations(_req: Request, res: Response): Promise<void> {
  try {
    const donations = await donationService.getRecentDonations(20);
    res.json({ success: true, data: donations });
  } catch (error) {
    console.error('Get recent donations error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch recent supporters' });
  }
}

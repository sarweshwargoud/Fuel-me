-- ============================================
-- Buy Me a Coffee — Donations Table
-- ============================================
-- Run this in Supabase SQL Editor or via CLI migration.

CREATE TABLE IF NOT EXISTS donations (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                VARCHAR(100),
  message             VARCHAR(200),
  amount              INTEGER NOT NULL,                 -- stored in paise (₹50 = 5000)
  currency            VARCHAR(3) DEFAULT 'INR',
  razorpay_order_id   VARCHAR(255) UNIQUE,
  razorpay_payment_id VARCHAR(255),
  status              VARCHAR(20) DEFAULT 'created'
                      CHECK (status IN ('created', 'pending', 'success', 'failed')),
  is_anonymous        BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching recent successful donations efficiently
CREATE INDEX IF NOT EXISTS idx_donations_status_created
  ON donations (status, created_at DESC);

-- Enable Row Level Security (service role key bypasses RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- No public policies needed — all access goes through the backend
-- using the service_role key which bypasses RLS.

import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from backend directory and workspace root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface EnvConfig {
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  FRONTEND_URL: string;
  PORT: number;
}

function getEnvVar(key: string, required = false, fallback = ''): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return (value || fallback).trim();
}

export const env: EnvConfig = {
  RAZORPAY_KEY_ID: getEnvVar('RAZORPAY_KEY_ID', true),
  RAZORPAY_KEY_SECRET: getEnvVar('RAZORPAY_KEY_SECRET', true),
  RAZORPAY_WEBHOOK_SECRET: getEnvVar('RAZORPAY_WEBHOOK_SECRET', false, ''),
  SUPABASE_URL: getEnvVar('SUPABASE_URL', false, ''),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false, ''),
  FRONTEND_URL: process.env.FRONTEND_URL?.trim() || 'http://localhost:5173',
  PORT: parseInt(process.env.PORT || '5000', 10),
};

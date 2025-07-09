import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get environment variables with defaults
export const PORT = process.env.PORT || '3000';
export const FAVRO_WEBHOOK_SECRET = process.env.FAVRO_WEBHOOK_SECRET || '';
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const WEBHOOK_URL = process.env.WEBHOOK_URL || `http://localhost:${PORT}/webhook`;

// Slack configuration
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || '';
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || '';
export const SLACK_APP_ID = process.env.SLACK_APP_ID || '';

import { WebhookData } from '../types';

/**
 * Log webhook data to console (no file saving)
 * @param data The webhook data to log
 * @param headers HTTP headers from the request
 * @returns Empty string (no file path since we don't save)
 */
export const saveWebhookData = (data: WebhookData, headers: any): string => {
  try {
    const timestamp = new Date().toISOString();
    
    // Just log to console that we received webhook data
    console.log(`Webhook received at ${timestamp}`);
    console.log(`Action: ${data.action}`);
    
    // For debugging purposes, you can uncomment this to see full data
    // console.log('Webhook data:', JSON.stringify(data, null, 2));
    
    return ''; // No file path returned since we're not saving files
  } catch (error) {
    console.error('Error processing webhook data:', error);
    return '';
  }
};

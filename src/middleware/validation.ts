import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { FAVRO_WEBHOOK_SECRET } from '../config';

// Get the webhook URL from environment or use default for development
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';

/**
 * Middleware to verify the Favro webhook signature
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 * @returns void | Response
 */
export const verifyWebhookSignature = (req: Request, res: Response, next: NextFunction): void | Response => {
  // Skip verification if no secret is configured (development only)
  if (!FAVRO_WEBHOOK_SECRET) {
    console.warn('WARNING: FAVRO_WEBHOOK_SECRET is not set. Webhook signature verification is disabled.');
    return next();
  }

  try {
    const signature = req.headers['x-favro-webhook'] as string;
    
    // If no signature header is present, reject the request
    if (!signature) {
      console.error('Webhook signature header is missing');
      return res.status(401).json({ error: 'Webhook signature verification failed' });
    }
    
    // According to Favro docs: "The header is a base64 digest of an HMAC-SHA1 hash. 
    // The hashed content is the concatenation of the payloadId and the URL exactly 
    // as it was provided during webhook creation."
    const webhookData = req.body;
    const payloadId = webhookData.payloadId || '';
    
    // The content to hash is the concatenation of payloadId and webhook URL
    const contentToHash = payloadId + WEBHOOK_URL;
    
    // Create HMAC-SHA1 hash and encode as base64
    const hmac = crypto.createHmac('sha1', FAVRO_WEBHOOK_SECRET);
    hmac.update(contentToHash);
    const calculatedSignature = hmac.digest('base64');
    
    // Compare the received signature with our calculated signature
    const isValid = signature === calculatedSignature;
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Webhook signature verification failed' });
    }
    
    // Signature is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    res.status(500).json({ error: 'Internal server error during webhook verification' });
  }
};

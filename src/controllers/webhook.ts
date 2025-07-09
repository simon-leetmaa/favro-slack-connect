import { Request, Response } from 'express';
import { WebhookData } from '../types';
import { saveWebhookData } from '../services/storage';
import { processWebhook } from '../services/webhook';

/**
 * Handle incoming webhook requests
 * @param req Express request
 * @param res Express response
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received webhook from Favro');
    
    // Parse the webhook data
    const webhookData: WebhookData = req.body;
    
    // Log the webhook data (console only, no file saving)
    saveWebhookData(webhookData, req.headers);
    
    // Process the webhook and get response message (await the promise)
    const responseMessage = await processWebhook(webhookData);
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: responseMessage
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing webhook'
    });
  }
};

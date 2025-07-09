import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook';
import { verifyWebhookSignature } from '../middleware/validation';

const router = Router();

// Webhook endpoint with signature verification middleware
router.post('/webhook', verifyWebhookSignature, handleWebhook);

export default router;

import { 
  WebhookData,
  FavroPingWebhook,
  FavroMovedWebhook,
  FavroCardUpdatedWebhook,
  FavroCardCreatedWebhook,
  FavroCardRemovedWebhook,
  FavroCardCommittedWebhook,
  FavroCommentCreatedWebhook,
  FavroCommentUpdatedWebhook,
  FavroCommentRemovedWebhook
} from '../types';
import { parseComment, getCommentSummary } from './commentParser';
import { slackService } from './slack';

/**
 * Handle a ping webhook (sent when setting up the webhook)
 * @param data The ping webhook data
 * @returns Response message
 */
export const handlePingWebhook = (data: FavroPingWebhook): string => {
  console.log('Received ping webhook from Favro');
  
  return 'Ping received successfully!';
};

/**
 * Handle a card created webhook
 * @param data The created webhook data
 * @returns Response message
 */
export const handleCardCreatedWebhook = (data: FavroCardCreatedWebhook): string => {
  const { sender, card } = data;
  const columnName = data.column?.name || 'Unknown';
  
  // Only log essential information
  console.log(`Card created: "${card.name}" by ${sender.name}`);
  
  return `Card created by ${sender.name}`;
};

/**
 * Handle a card removed webhook
 * @param data The removed webhook data
 * @returns Response message
 */
export const handleCardRemovedWebhook = (data: FavroCardRemovedWebhook): string => {
  const { sender, card } = data;
  
  console.log(`Card removed: "${card.name}" by ${sender.name}`);
  
  return `Card removed by ${sender.name}`;
};

/**
 * Handle a card committed webhook (moved between boards)
 * @param data The committed webhook data
 * @returns Response message
 */
export const handleCardCommittedWebhook = (data: FavroCardCommittedWebhook): string => {
  const { sender, card, widget, sourceWidget } = data;
  
  console.log(`Card committed: "${card.name}" from ${sourceWidget.name} to ${widget.name}`);
  
  return `Card committed from ${sourceWidget.name} to ${widget.name}`;
};

/**
 * Handle a card moved webhook
 * @param data The moved webhook data
 * @returns Response message
 */
export const handleMovedWebhook = (data: FavroMovedWebhook): string => {
  const { sender, card, column, sourceColumn } = data;
  
  console.log(`Card moved: "${card.name}" from ${sourceColumn.name} to ${column.name}`);
  
  return `Card moved from ${sourceColumn.name} to ${column.name}`;
};

/**
 * Handle a card updated webhook
 * @param data The updated webhook data
 * @returns Response message
 */
export const handleCardUpdatedWebhook = (data: FavroCardUpdatedWebhook): string => {
  const { sender, card } = data;
  
  console.log(`Card updated: "${card.name}" by ${sender.name}`);
  
  return `Card updated by ${sender.name}`;
};

/**
 * Handle a comment created webhook
 * @param data The comment created webhook data
 * @returns Response message
 */
export const handleCommentCreatedWebhook = async (data: FavroCommentCreatedWebhook): Promise<string> => {
  const { sender, card, comment } = data;
  
  // Parse the comment to check for user mentions
  const parsedComment = parseComment(comment);
  
  // Build an appropriate message based on whether the comment has mentions
  let message = `Comment added to "${card.name}" by ${sender.name}`;
  
  if (parsedComment.hasMentions) {
    const mentionedUsers = parsedComment.mentions.map((m) => m.username).join(', ');
    console.log(`${message} with ${parsedComment.mentions.length} user mention(s): ${mentionedUsers}`);
    message = `${sender.name} mentioned ${mentionedUsers} in a comment on "${card.name}"`;
    
    // Send Slack notifications to mentioned users
    const notificationCount = await slackService.notifyMentionedUsers(
      sender, 
      card, 
      comment, 
      parsedComment.mentions
    );
    
    if (notificationCount > 0) {
      message += ` (${notificationCount} Slack notification(s) sent)`;
    }
  } else {
    // Just log a simplified message for non-mention comments
    console.log(message);
  }
  
  return message;
};

/**
 * Handle a comment updated webhook
 * @param data The comment updated webhook data
 * @returns Response message
 */
export const handleCommentUpdatedWebhook = async (data: FavroCommentUpdatedWebhook): Promise<string> => {
  const { sender, card, comment } = data;
  
  // Parse the comment to check for user mentions
  const parsedComment = parseComment(comment);
  
  // Build an appropriate message based on whether the comment has mentions
  let message = `Comment updated on "${card.name}" by ${sender.name}`;
  
  if (parsedComment.hasMentions) {
    const mentionedUsers = parsedComment.mentions.map((m) => m.username).join(', ');
    console.log(`${message} with ${parsedComment.mentions.length} user mention(s): ${mentionedUsers}`);
    message = `${sender.name} updated a comment mentioning ${mentionedUsers} on "${card.name}"`;
    
    // Send Slack notifications to mentioned users about the update
    const notificationCount = await slackService.notifyCommentUpdate(
      sender, 
      card, 
      comment, 
      parsedComment.mentions
    );
    
    if (notificationCount > 0) {
      message += ` (${notificationCount} Slack notification(s) sent)`;
    }
  } else {
    // Just log a simplified message for non-mention comments
    console.log(message);
  }
  
  return message;
};

/**
 * Handle a comment removed webhook
 * @param data The comment removed webhook data
 * @returns Response message
 */
export const handleCommentRemovedWebhook = (data: FavroCommentRemovedWebhook): string => {
  const { sender, card, comment } = data;
  
  // Create a summary of the removed comment
  const commentSummary = getCommentSummary(comment.comment || '', 50);
  console.log(`Comment removed from "${card.name}" by ${sender.name}: "${commentSummary}"`);
  
  return `Comment removed by ${sender.name}`;
};

/**
 * Type guards to check webhook types
 */
const isCommentCreatedWebhook = (data: WebhookData): data is FavroCommentCreatedWebhook => {
  return data.action === 'created' && 'comment' in data;
};

const isCommentUpdatedWebhook = (data: WebhookData): data is FavroCommentUpdatedWebhook => {
  return data.action === 'updated' && 'comment' in data;
};

const isCommentRemovedWebhook = (data: WebhookData): data is FavroCommentRemovedWebhook => {
  return data.action === 'removed' && 'comment' in data;
};

/**
 * Process a webhook based on its action type
 * @param data The webhook data
 * @returns Promise resolving to response message
 */
export const processWebhook = async (data: WebhookData): Promise<string> => {
  let responseMessage = 'Webhook received successfully';
  
  // Handle each type of webhook
  switch (data.action) {
    case 'ping':
      responseMessage = handlePingWebhook(data as FavroPingWebhook);
      break;
    
    // Card and comment actions
    case 'created':
      if (isCommentCreatedWebhook(data)) {
        responseMessage = await handleCommentCreatedWebhook(data);
      } else {
        responseMessage = handleCardCreatedWebhook(data as FavroCardCreatedWebhook);
      }
      break;
      
    case 'updated':
      if (isCommentUpdatedWebhook(data)) {
        responseMessage = await handleCommentUpdatedWebhook(data);
      } else {
        responseMessage = handleCardUpdatedWebhook(data as FavroCardUpdatedWebhook);
      }
      break;
      
    case 'removed':
      if (isCommentRemovedWebhook(data)) {
        responseMessage = handleCommentRemovedWebhook(data);
      } else {
        responseMessage = `Card removed by ${data.sender.name}`;
      }
      break;
      
    case 'moved':
      responseMessage = handleMovedWebhook(data as FavroMovedWebhook);
      break;
      
    case 'committed':
      responseMessage = handleCardCommittedWebhook(data as FavroCardCommittedWebhook);
      break;
      
    default:
      // For other webhook types, log and provide generic response
      console.log(`Received unhandled webhook action: ${data.action}`);
      responseMessage = `Received webhook with action: ${data.action}`;
  }
  
  return responseMessage;
};

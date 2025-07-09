import { WebClient } from '@slack/web-api';
import { UserMention } from './commentParser';
import { FavroSender, FavroCard, FavroComment } from '../types';
import { SLACK_BOT_TOKEN } from '../config';
import { userMapping } from '../config/userMapping';

/**
 * Slack service for sending messages to users
 */
class SlackService {
  private client: WebClient;
  private initialized: boolean;

  constructor() {
    this.initialized = false;
    this.client = new WebClient();
    this.initialize();
  }

  /**
   * Initialize the Slack client with the bot token
   */
  private initialize(): void {
    if (!SLACK_BOT_TOKEN) {
      console.warn('WARNING: SLACK_BOT_TOKEN is not set. Slack notifications are disabled.');
      return;
    }

    try {
      this.client = new WebClient(SLACK_BOT_TOKEN);
      this.initialized = true;
      console.log('Slack client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Slack client:', error);
    }
  }

  /**
   * Get the Slack user ID for a Favro username
   * @param favroUsername The Favro username
   * @returns The Slack user ID or null if not found
   */
  private getSlackUserIdForFavroUser(favroUsername: string): string | null {
    return userMapping[favroUsername] || null;
  }

  /**
   * Send a direct message to a Slack user
   * @param slackUserId The Slack user ID
   * @param message The message to send
   * @returns Promise resolving to true if successful, false otherwise
   */
  private async sendDirectMessage(slackUserId: string, message: string): Promise<boolean> {
    if (!this.initialized) {
      console.warn('Slack client is not initialized. Cannot send message.');
      return false;
    }

    try {
      await this.client.chat.postMessage({
        channel: slackUserId,
        text: message,
        unfurl_links: false,
        unfurl_media: false
      });
      return true;
    } catch (error) {
      console.error('Error sending Slack message:', error);
      return false;
    }
  }

  /**
   * Send notifications to users mentioned in a comment
   * @param sender The sender of the comment
   * @param card The card the comment was made on
   * @param comment The comment object
   * @param mentions The parsed mentions from the comment
   * @returns Promise resolving to the number of notifications sent
   */
  async notifyMentionedUsers(
    sender: FavroSender, 
    card: FavroCard, 
    comment: FavroComment, 
    mentions: UserMention[]
  ): Promise<number> {
    if (!this.initialized || mentions.length === 0) {
      return 0;
    }

    const cardName = card.name;
    const senderName = sender.name;
    const commentText = comment.comment;
    
    // Count successful notifications
    let notificationsSent = 0;

    // Try to send a message to each mentioned user
    for (const mention of mentions) {
      const slackUserId = this.getSlackUserIdForFavroUser(mention.username);
      
      if (slackUserId) {
        const message = `*${senderName}* mentioned you in a comment on card "*${cardName}*":\n\n>${commentText}`;
        
        const success = await this.sendDirectMessage(slackUserId, message);
        if (success) {
          notificationsSent++;
          console.log(`Notification sent to ${mention.username} (${slackUserId})`);
        }
      } else {
        console.log(`No Slack mapping found for Favro user: ${mention.username}`);
      }
    }

    return notificationsSent;
  }

  /**
   * Send a notification about a comment update that mentions users
   * @param sender The sender of the comment
   * @param card The card the comment was made on
   * @param comment The comment object
   * @param mentions The parsed mentions from the comment
   * @returns Promise resolving to the number of notifications sent
   */
  async notifyCommentUpdate(
    sender: FavroSender, 
    card: FavroCard, 
    comment: FavroComment, 
    mentions: UserMention[]
  ): Promise<number> {
    if (!this.initialized || mentions.length === 0) {
      return 0;
    }

    const cardName = card.name;
    const senderName = sender.name;
    const commentText = comment.comment;
    
    // Count successful notifications
    let notificationsSent = 0;

    // Try to send a message to each mentioned user
    for (const mention of mentions) {
      const slackUserId = this.getSlackUserIdForFavroUser(mention.username);
      
      if (slackUserId) {
        const message = `*${senderName}* updated a comment that mentions you on card "*${cardName}*":\n\n>${commentText}`;
        
        const success = await this.sendDirectMessage(slackUserId, message);
        if (success) {
          notificationsSent++;
          console.log(`Update notification sent to ${mention.username} (${slackUserId})`);
        }
      }
    }

    return notificationsSent;
  }
}

// Export a singleton instance
export const slackService = new SlackService();

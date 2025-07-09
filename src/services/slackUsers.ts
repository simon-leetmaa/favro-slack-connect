import { WebClient } from '@slack/web-api';
import { SLACK_BOT_TOKEN } from '../config';

/**
 * Service to interact with Slack users
 */
export class SlackUserService {
  private client: WebClient;

  constructor(token: string = SLACK_BOT_TOKEN) {
    this.client = new WebClient(token);
  }

  /**
   * Fetch all users from the Slack workspace
   * @param options Optional parameters for the users.list API call
   * @returns Array of user objects with id, name, real_name, and email
   */
  async getAllUsers(options = {}) {
    try {
      const result = await this.client.users.list(options);
      
      if (result.ok && result.members) {
        // Filter out bots, app users, and deleted accounts
        const realUsers = result.members.filter(user => 
          !user.is_bot && 
          !user.deleted &&
          user.id !== 'USLACKBOT' // Filter out Slackbot
        );
        
        // Map to a simpler format
        return realUsers.map(user => ({
          id: user.id,
          name: user.name,
          real_name: user.real_name || user.name,
          email: user.profile?.email,
          display_name: user.profile?.display_name || user.name
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching Slack users:', error);
      throw new Error('Failed to fetch users from Slack');
    }
  }

  /**
   * Find a Slack user by their email address
   * This is useful for automatic mapping since emails are often consistent across systems
   * @param email The email address to search for
   * @returns User object if found, null otherwise
   */
  async findUserByEmail(email: string) {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      return null;
    }
  }

  /**
   * Find a Slack user by display name or real name
   * @param name The name to search for
   * @returns User object if found, null otherwise
   */
  async findUserByName(name: string) {
    try {
      const users = await this.getAllUsers();
      const normalizedName = name.toLowerCase();
      
      // Try exact matches first
      let user = users.find(u => 
        u.name?.toLowerCase() === normalizedName ||
        u.display_name?.toLowerCase() === normalizedName ||
        u.real_name?.toLowerCase() === normalizedName
      );
      
      // If no exact match, try partial matches
      if (!user) {
        user = users.find(u => 
          u.name?.toLowerCase().includes(normalizedName) ||
          u.display_name?.toLowerCase().includes(normalizedName) ||
          u.real_name?.toLowerCase().includes(normalizedName)
        );
      }
      
      return user || null;
    } catch (error) {
      console.error(`Error finding user by name ${name}:`, error);
      return null;
    }
  }
}

export const slackUserService = new SlackUserService();

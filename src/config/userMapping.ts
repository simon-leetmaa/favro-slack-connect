/**
 * User mapping between Favro usernames and Slack user IDs
 * This mapping allows the integration to convert Favro usernames into Slack user IDs
 * when sending notifications about mentions or updates
 */
import { UserMapping } from '../types';

/**
 * Maps Favro usernames to Slack user IDs
 * Format: { 'favroUsername': 'slackUserId' }
 */
export const userMapping: UserMapping = {
  "Adam Svensson": "U91238WEOBY",
  "Erik Almqvist": "U094YFADS29"
};

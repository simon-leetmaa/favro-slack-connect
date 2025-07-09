import { FavroComment } from '../types';

/**
 * Represents a user mention found in a comment
 */
export interface UserMention {
  username: string;   // The username that was mentioned
  originalTag: string; // The original tag text including brackets
  position: number;   // Position in the comment where the mention starts
}

/**
 * Parsed comment data with extracted information
 */
export interface ParsedComment {
  commentId: string;
  text: string;
  hasMentions: boolean;
  mentions: UserMention[];
}

/**
 * Parse a Favro comment to extract user mentions
 * @param comment The Favro comment object to parse
 * @returns Parsed comment data with mentions
 */
export const parseComment = (comment: FavroComment): ParsedComment => {
  const text = comment.comment || '';
  const commentId = comment.commentId || '';
  const mentions: UserMention[] = [];
  
  // Regular expression to find user mentions in the format [@username]
  const mentionRegex = /\[@([^\]]+)\]/g;
  let match;
  
  // Find all mentions in the comment
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],        // The username without brackets
      originalTag: match[0],     // The full tag with brackets
      position: match.index      // Position in the string
    });
  }
  
  return {
    commentId,
    text,
    hasMentions: mentions.length > 0,
    mentions
  };
};

/**
 * Determine if a comment contains mentions of users
 * @param comment The comment to check
 * @returns True if the comment mentions at least one user
 */
export const hasUserMentions = (comment: FavroComment): boolean => {
  const mentionRegex = /\[@[^\]]+\]/;
  return mentionRegex.test(comment.comment || '');
};

/**
 * Extract a summary of the comment, truncating if it's too long
 * @param comment The comment text
 * @param maxLength Maximum length before truncation
 * @returns A summarized version of the comment
 */
export const getCommentSummary = (comment: string, maxLength: number = 100): string => {
  if (!comment) return '';
  
  if (comment.length <= maxLength) {
    return comment;
  }
  
  return comment.substring(0, maxLength) + '...';
};

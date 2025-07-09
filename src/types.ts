/**
 * TypeScript interface definitions for the Favro webhook data
 * 
 * Based on the actual webhook payload from Favro
 */

/**
 * Represents a sender in Favro webhooks
 */
export interface FavroSender {
  userId: string;
  name: string;
  email: string;
}

/**
 * Represents a custom field in a Favro card
 */
export interface FavroCustomField {
  customFieldId: string;
  value: any; // This could be an array, object with percentage, or other types
}

/**
 * Represents time tracking on a Favro board
 */
export interface FavroTimeOnBoard {
  time: number;
  isStopped: boolean;
}

/**
 * Represents time spent on different columns
 */
export interface FavroTimeOnColumns {
  [columnId: string]: number;
}

/**
 * Represents a comment on a Favro card
 */
export interface FavroComment {
  commentId: string;
  cardCommonId: string;
  organizationId: string;
  userId: string;
  comment: string;
  created: string;
  lastUpdated?: string;
  attachments: any[];
}

/**
 * Represents a Favro card
 */
export interface FavroCard {
  cardId: string;
  cardCommonId: string;
  organizationId: string;
  archived: boolean;
  position: number;
  listPosition: number;
  name: string;
  widgetCommonId: string;
  columnId: string;
  laneId: string | null;
  isLane: boolean;
  parentCardId: string | null;
  sheetPosition: number;
  detailedDescription?: string;
  dependencies: any[];
  tags: any[];
  sequentialId: number;
  createdByUserId: string;
  createdAt: string;
  assignments: any[];
  numComments?: number;
  tasksTotal: number;
  tasksDone: number;
  attachments: any[];
  customFields: FavroCustomField[];
  timeOnBoard: FavroTimeOnBoard;
  timeOnColumns: FavroTimeOnColumns;
  favroAttachments: any[];
}

/**
 * Represents a column in a Favro board
 */
export interface FavroColumn {
  columnId: string;
  name: string;
  color?: string;
  organizationId?: string;
  widgetCommonId?: string;
  position?: number;
  cardCount?: number;
  timeSum?: number;
  estimationSum?: number;
}

/**
 * Represents a Favro board widget
 */
export interface FavroWidget {
  widgetCommonId: string;
  organizationId: string;
  name: string;
  type: string;
  color: string;
  ownerRole: string;
  editRole: string;
  collectionIds: string[];
  archived: boolean;
  columns: FavroColumn[];
}

/**
 * Represents a ping action from Favro when testing webhook configuration
 */
export interface FavroPingWebhook {
  payloadId: string;
  action: 'ping';
  hookId: string;
  hook: {
    url: string;
  };
}

/**
 * Represents a card created event
 */
export interface FavroCardCreatedWebhook {
  payloadId: string;
  action: 'created';
  sender: FavroSender;
  card: FavroCard;
  widget: FavroWidget;
  column?: FavroColumn; // Only present in some cases
}

/**
 * Represents a card removed event
 */
export interface FavroCardRemovedWebhook {
  payloadId: string;
  action: 'removed';
  sender: FavroSender;
  card: FavroCard;
  widget: FavroWidget;
}

/**
 * Represents a card committed event (moved between boards)
 */
export interface FavroCardCommittedWebhook {
  payloadId: string;
  action: 'committed';
  sender: FavroSender;
  card: FavroCard;
  widget: FavroWidget;
  sourceWidget: FavroWidget;
}

/**
 * Represents a card moved event (between columns)
 */
export interface FavroMovedWebhook {
  payloadId: string;
  action: 'moved';
  sender: FavroSender;
  card: FavroCard;
  widget: FavroWidget;
  column: FavroColumn;
  sourceColumn: FavroColumn;
}

/**
 * Represents a card updated event
 */
export interface FavroCardUpdatedWebhook {
  payloadId: string;
  action: 'updated';
  sender: FavroSender;
  card: FavroCard;
  widget: FavroWidget;
}

/**
 * Represents a comment created event
 */
export interface FavroCommentCreatedWebhook {
  payloadId: string;
  action: 'created';
  sender: FavroSender;
  card: FavroCard;
  comment: FavroComment;
}

/**
 * Represents a comment updated event
 */
export interface FavroCommentUpdatedWebhook {
  payloadId: string;
  action: 'updated';
  sender: FavroSender;
  card: FavroCard;
  comment: FavroComment;
}

/**
 * Represents a comment removed event
 */
export interface FavroCommentRemovedWebhook {
  payloadId: string;
  action: 'removed';
  sender: FavroSender;
  card: FavroCard;
  comment: FavroComment;
}

/**
 * Base interface for all Favro webhooks
 * Use for unknown or future webhook types
 */
export interface FavroBaseWebhook {
  payloadId: string;
  action: string;
  [key: string]: any;
}

/**
 * Union type covering all possible Favro webhook types
 */
export type WebhookData = 
  | FavroPingWebhook 
  | FavroCardCreatedWebhook
  | FavroCardRemovedWebhook
  | FavroCardCommittedWebhook
  | FavroMovedWebhook 
  | FavroCardUpdatedWebhook
  | FavroCommentCreatedWebhook
  | FavroCommentUpdatedWebhook
  | FavroCommentRemovedWebhook
  | FavroBaseWebhook;

/**
 * Interface for the mapping between Favro usernames and Slack user IDs
 */
export interface UserMapping {
  [favroUsername: string]: string; // Maps Favro username to Slack user ID
}

import { type z } from 'zod';
import {
  MessageItemSchema,
  MessagesDataSchema,
  MessagesRequestSchema,
  MessagesResponseSchema,
} from './message.zod';

export type MessageItem = z.infer<typeof MessageItemSchema>;
export type MessagesData = z.infer<typeof MessagesDataSchema>;
export type MessagesResponse = z.infer<typeof MessagesResponseSchema>;
export type MessagesRequest = z.infer<typeof MessagesRequestSchema>;

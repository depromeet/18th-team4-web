import z from 'zod';
import {
  SessionItemSchema,
  SessionListDataSchema,
  SessionListRequestSchema,
  SessionListResponseSchema,
  SessionStatusSchema,
} from './ai-chat.zod';

export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type SessionItem = z.infer<typeof SessionItemSchema>;
export type SessionListData = z.infer<typeof SessionListDataSchema>;
export type SessionListResponse = z.infer<typeof SessionListResponseSchema>;
export type SessionListRequest = z.infer<typeof SessionListRequestSchema>;

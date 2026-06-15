import z from 'zod';
import {
  BookSessionBookSchema,
  BookSessionDataSchema,
  BookSessionItemSchema,
  BookSessionRequestSchema,
  BookSessionResponseSchema,
  CreateSessionDataSchema,
  CreateSessionRequestSchema,
  CreateSessionResponseSchema,
  SessionItemSchema,
  SessionStatusSchema,
} from './ai-chat.zod';

export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type BookSessionItem = z.infer<typeof BookSessionItemSchema>;
export type SessionItem = z.infer<typeof SessionItemSchema>;
export type BookSessionBook = z.infer<typeof BookSessionBookSchema>;
export type BookSessionData = z.infer<typeof BookSessionDataSchema>;
export type BookSessionResponse = z.infer<typeof BookSessionResponseSchema>;
export type BookSessionRequest = z.infer<typeof BookSessionRequestSchema>;
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export type CreateSessionData = z.infer<typeof CreateSessionDataSchema>;
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

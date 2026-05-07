import { type z } from 'zod';
import {
  CreateSessionDataSchema,
  CreateSessionResponseSchema,
  DoneEventSchema,
  ErrorEventSchema,
  RateLimitSchema,
  SendMessageRequestSchema,
  TokenEventSchema,
} from './chat.zod';

export type CreateSessionData = z.infer<typeof CreateSessionDataSchema>;
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
export type TokenEvent = z.infer<typeof TokenEventSchema>;
export type DoneEvent = z.infer<typeof DoneEventSchema>;
export type RateLimit = z.infer<typeof RateLimitSchema>;
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;

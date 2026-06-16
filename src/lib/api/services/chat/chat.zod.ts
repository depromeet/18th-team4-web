import z from 'zod';
import { createResponseSchema } from '@/lib/api/types';

export const CreateSessionDataSchema = z.object({
  sessionId: z.number(),
});

export const CreateSessionResponseSchema = createResponseSchema(CreateSessionDataSchema);

export const SendMessageRequestSchema = z.object({
  content: z.string().min(1),
});

export const TokenEventSchema = z.object({
  delta: z.string(),
});

export const DoneEventSchema = z.object({
  messageId: z.coerce.number(),
  tokenCount: z.unknown().optional(),
  createdAt: z.string(),
});

export const RateLimitSchema = z.object({
  retryAfterSeconds: z.number().optional(),
  limitRequests: z.number().optional(),
  remainingRequests: z.number().optional(),
  resetRequestsSeconds: z.number().optional(),
  resetTokensSeconds: z.number().optional(),
});

export const ErrorEventSchema = z.object({
  code: z.string(),
  message: z.string(),
  rateLimit: RateLimitSchema.optional(),
});

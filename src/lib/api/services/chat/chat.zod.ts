import z from 'zod';
import { createResponseSchema } from '@/lib';

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
  messageId: z.number(),
  tokenCount: z.number(),
  createdAt: z.string(),
});

export const RateLimitSchema = z.object({
  retryAfterSeconds: z.number(),
});

export const ErrorEventSchema = z.object({
  code: z.enum([
    'AI_RATE_LIMIT_BURST',
    'AI_QUOTA_EXHAUSTED',
    'AI_PROVIDER_ERROR',
    'AI_PROVIDER_TRANSIENT',
    'AI_STREAM_INTERRUPTED',
  ]),
  message: z.string(),
  rateLimit: RateLimitSchema.optional(),
});

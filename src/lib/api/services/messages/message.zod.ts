import z from 'zod';
import { createResponseSchema } from '@/lib';

export const MessageItemSchema = z.object({
  id: z.string(),
  role: z.enum(['USER', 'ASSISTANT']),
  content: z.string(),
  createdAt: z.string(),
});

export const MessagesDataSchema = z.object({
  messages: z.array(MessageItemSchema),
  page: z.number(),
  size: z.number(),
  hasNext: z.boolean(),
});

export const MessagesResponseSchema = createResponseSchema(MessagesDataSchema);

export const MessagesRequestSchema = z.object({
  sessionId: z.string(),
  page: z.number().int().min(1),
  size: z.number().int().min(1),
});

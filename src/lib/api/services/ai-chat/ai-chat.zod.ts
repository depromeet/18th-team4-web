import z from 'zod';
import { createResponseSchema } from '@/lib/api/types';

export const SessionStatusSchema = z.enum(['ACTIVE', 'SUMMARIZING', 'CLOSED', 'FAILED']);

export const SessionItemSchema = z.object({
  sessionId: z.number(),
  title: z.string(),
  status: SessionStatusSchema,
  lastChattedDate: z.string(),
});

export const SessionListDataSchema = z.object({
  sessions: z.array(SessionItemSchema),
  page: z.number(),
  size: z.number(),
  hasNext: z.boolean(),
});

export const SessionListResponseSchema = createResponseSchema(SessionListDataSchema);

export const SessionListRequestSchema = z.object({
  userBookId: z.number(),
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).default(20),
});

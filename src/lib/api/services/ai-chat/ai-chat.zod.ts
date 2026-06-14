import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SessionStatusSchema = z.enum(['ACTIVE', 'SUMMARIZING', 'CLOSED', 'FAILED']);

export const BookSessionItemSchema = z.object({
  sessionId: z.number(),
  latestSummaryContent: z.string().nullable(),
  lastChattedDate: z.string(),
});

export const SessionItemSchema = BookSessionItemSchema.extend({
  title: z.string(),
  status: SessionStatusSchema,
});

export const BookSessionBookSchema = z.object({
  coverUrl: z.string(),
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publishedYear: z.number(),
  isbn13: z.string(),
});

export const BookSessionResponseDataSchema = z.object({
  book: BookSessionBookSchema,
  sessions: z.array(BookSessionItemSchema),
});

export const BookSessionDataSchema = z.object({
  book: BookSessionBookSchema,
  sessions: z.array(SessionItemSchema),
});

export const BookSessionResponseSchema = createResponseSchema(BookSessionResponseDataSchema);

export const BookSessionRequestSchema = z.object({
  userBookId: z.number().int().positive(),
});

export const LegacySessionItemSchema = z.object({
  sessionId: z.number(),
  title: z.string(),
  status: SessionStatusSchema,
  lastChattedDate: z.string(),
});

export const SessionListDataSchema = z.object({
  sessions: z.array(LegacySessionItemSchema),
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

export const CreateSessionRequestSchema = z.object({
  userBookId: z.number(),
});

export const CreateSessionDataSchema = z.object({
  sessionId: z.number(),
});

export const CreateSessionResponseSchema = createResponseSchema(CreateSessionDataSchema);

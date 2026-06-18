import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SummaryListItemSchema = z.object({
  summaryId: z.number(),
  bookTitle: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const SummaryListDataSchema = z.object({
  summaries: z.array(SummaryListItemSchema),
  page: z.number(),
  size: z.number(),
  hasNext: z.boolean(),
});

export const SummaryListResponseSchema = createResponseSchema(SummaryListDataSchema);

export const SummaryListRequestSchema = z.object({
  page: z.number().int().min(1),
  size: z.number().int().min(1).optional(),
});

export const SummaryCalendarItemSchema = z.object({
  chatSessionId: z.number(),
  summaryId: z.number().nullable(),
  bookTitle: z.string(),
  chatSummary: z.string(),
  lastChattedAt: z.string(),
});

export const SummaryDetailSchema = z.object({
  aiChatSessionId: z.coerce.number(),
  title: z.string(),
  body: z.string(),
});

export const SummaryDetailResponseSchema = createResponseSchema(
  z.object({
    summary: SummaryDetailSchema,
  }),
);

export const SummaryCalendarDataSchema = z.object({
  records: z.array(SummaryCalendarItemSchema),
});

export const SummaryCalendarResponseSchema = createResponseSchema(SummaryCalendarDataSchema);

export const SummaryCalendarRequestSchema = z.object({
  yearMonth: z.string(),
});

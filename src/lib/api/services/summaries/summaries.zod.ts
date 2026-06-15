import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SummaryListItemSchema = z.object({
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

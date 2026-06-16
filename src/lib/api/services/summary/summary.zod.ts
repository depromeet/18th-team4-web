import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SummaryDataSchema = z.object({
  summaryId: z.coerce.number().optional(),
  title: z.string(),
  body: z.string(),
  quote: z.string().nullable(),
});

export const SummaryResponseSchema = createResponseSchema(SummaryDataSchema);

export const UpdateSummaryRequestSchema = z.object({
  title: z.string().nonempty({ message: 'title must not be empty' }),
  body: z.string().nonempty({ message: 'body must not be empty' }),
});

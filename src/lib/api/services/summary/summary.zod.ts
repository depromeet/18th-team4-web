import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SummaryDataSchema = z.object({
  title: z.string(),
  body: z.string(),
  quote: z.string().nullable(),
});

export const SummaryResponseSchema = createResponseSchema(SummaryDataSchema);

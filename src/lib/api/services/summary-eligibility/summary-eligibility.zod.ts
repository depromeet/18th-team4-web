import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SummaryEligibilityDataSchema = z.object({
  eligible: z.boolean(),
  progressPercent: z.number(),
});

export const SummaryEligibilityResponseSchema = createResponseSchema(SummaryEligibilityDataSchema);

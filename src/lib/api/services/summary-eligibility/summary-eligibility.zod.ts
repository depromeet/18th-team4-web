import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SummaryEligibilityDataSchema = z.object({
  eligible: z.boolean(),
});

export const SummaryEligibilityResponseSchema = createResponseSchema(SummaryEligibilityDataSchema);

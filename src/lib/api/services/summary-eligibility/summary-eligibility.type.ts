import { type z } from 'zod';
import {
  SummaryEligibilityDataSchema,
  SummaryEligibilityResponseSchema,
} from './summary-eligibility.zod';

export type SummaryEligibilityData = z.infer<typeof SummaryEligibilityDataSchema>;
export type SummaryEligibilityResponse = z.infer<typeof SummaryEligibilityResponseSchema>;

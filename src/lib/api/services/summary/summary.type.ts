import { type z } from 'zod';
import { SummaryDataSchema, SummaryResponseSchema } from './summary.zod';

export type SummaryData = z.infer<typeof SummaryDataSchema>;
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

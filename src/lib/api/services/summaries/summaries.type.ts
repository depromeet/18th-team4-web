import z from 'zod';
import {
  SummaryListDataSchema,
  SummaryListItemSchema,
  SummaryListRequestSchema,
  SummaryListResponseSchema,
} from './summaries.zod';

export type SummaryListItem = z.infer<typeof SummaryListItemSchema>;
export type SummaryListData = z.infer<typeof SummaryListDataSchema>;
export type SummaryListResponse = z.infer<typeof SummaryListResponseSchema>;
export type SummaryListRequest = z.infer<typeof SummaryListRequestSchema>;

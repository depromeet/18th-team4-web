import z from 'zod';
import {
  SummaryCalendarDataSchema,
  SummaryCalendarItemSchema,
  SummaryCalendarRequestSchema,
  SummaryCalendarResponseSchema,
  SummaryDetailResponseSchema,
  SummaryDetailSchema,
  SummaryListDataSchema,
  SummaryListItemSchema,
  SummaryListRequestSchema,
  SummaryListResponseSchema,
} from './summaries.zod';

export type SummaryListItem = z.infer<typeof SummaryListItemSchema>;
export type SummaryListData = z.infer<typeof SummaryListDataSchema>;
export type SummaryListResponse = z.infer<typeof SummaryListResponseSchema>;
export type SummaryListRequest = z.infer<typeof SummaryListRequestSchema>;
export type SummaryCalendarItem = z.infer<typeof SummaryCalendarItemSchema>;
export type SummaryDetail = z.infer<typeof SummaryDetailSchema>;
export type SummaryDetailResponse = z.infer<typeof SummaryDetailResponseSchema>;
export type SummaryCalendarData = z.infer<typeof SummaryCalendarDataSchema>;
export type SummaryCalendarResponse = z.infer<typeof SummaryCalendarResponseSchema>;
export type SummaryCalendarRequest = z.infer<typeof SummaryCalendarRequestSchema>;

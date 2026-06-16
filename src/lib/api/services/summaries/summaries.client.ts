import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { clientAuthHttp } from '@/lib/api/http/clientAuthHttp';
import {
  type SummaryCalendarRequest,
  type SummaryCalendarResponse,
  type SummaryDetail,
  type SummaryDetailResponse,
  type SummaryListRequest,
  type SummaryListResponse,
} from './summaries.type';

export const getSummaries = async (params: SummaryListRequest) => {
  const query = new URLSearchParams({
    page: String(params.page),
  });
  if (params.size !== undefined) query.set('size', String(params.size));

  const response = await clientAuthHttp.get<SummaryListResponse>(
    `${ENDPOINTS.SUMMARIES.list()}?${query.toString()}`,
  );

  return response.data;
};

export const getSummaryCalendar = async (params: SummaryCalendarRequest) => {
  const query = new URLSearchParams({
    yearMonth: params.yearMonth,
  });

  const response = await clientAuthHttp.get<SummaryCalendarResponse>(
    `${ENDPOINTS.SUMMARIES.calendar()}?${query.toString()}`,
  );

  return response.data;
};

export const getSummaryDetail = async (summaryId: string): Promise<SummaryDetail> => {
  const response = await publicHttp.get<SummaryDetailResponse>(
    ENDPOINTS.SUMMARIES.detail(summaryId),
  );

  return response.data.summary;
};

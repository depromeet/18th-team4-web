import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { serverAuthHttp } from '@/lib/api/http/serverAuthHttp';
import { type SummaryListRequest, type SummaryListResponse } from './summaries.type';

export const getSummariesServer = cache(async (params: SummaryListRequest) => {
  const query = new URLSearchParams({
    page: String(params.page),
  });
  if (params.size !== undefined) query.set('size', String(params.size));

  const response = await serverAuthHttp.get<SummaryListResponse>(
    `${ENDPOINTS.SUMMARIES.list()}?${query.toString()}`,
  );

  return response.data;
});

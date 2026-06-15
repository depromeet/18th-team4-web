import { ENDPOINTS } from '@/constants';
import { clientAuthHttp } from '@/lib/api/http/clientAuthHttp';
import { type SummaryListRequest, type SummaryListResponse } from './summaries.type';

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

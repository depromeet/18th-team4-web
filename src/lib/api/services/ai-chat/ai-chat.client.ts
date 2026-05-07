import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type SessionListRequest, type SessionListResponse } from './ai-chat.type';

export const getSessions = async (params: SessionListRequest) => {
  const query = new URLSearchParams({
    userBookId: String(params.userBookId),
    page: String(params.page),
    size: String(params.size),
  });

  const response = await publicHttp.get<SessionListResponse>(
    `${ENDPOINTS.AI_CHAT.getSessions()}?${query.toString()}`,
  );

  return response.data;
};

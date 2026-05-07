import { ENDPOINTS } from '@/constants';
import { clientAuthHttp } from '@/lib/api/http/clientAuthHttp';
import { type MessagesRequest, type MessagesResponse } from './message.type';

export const getMessages = async (params: MessagesRequest) => {
  const query = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });

  const response = await clientAuthHttp.get<MessagesResponse>(
    `${ENDPOINTS.AI_CHAT.getMessages(params.sessionId)}?${query.toString()}`,
  );

  return response.data;
};

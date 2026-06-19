import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type BookSessionResponse } from './ai-chat.type';
import { normalizeBookSessionData } from './ai-chat.utils';

export const getBookSessionsServer = cache(async (userBookId: number) => {
  const response = await publicHttp.get<BookSessionResponse>(
    ENDPOINTS.AI_CHAT.getSessions(userBookId),
  );

  return normalizeBookSessionData(response.data);
});

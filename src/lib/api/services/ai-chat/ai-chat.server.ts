import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type BookSessionData, type BookSessionResponse } from './ai-chat.type';

const normalizeBookSessionData = (data: BookSessionResponse['data']): BookSessionData => ({
  book: data.book,
  sessions: data.sessions.map((session) => ({
    ...session,
    title: session.latestSummaryContent ?? '아직 작성된 감상 기록이 없어요',
    status: 'ACTIVE',
  })),
});

export const getBookSessionsServer = cache(async (userBookId: number) => {
  const response = await publicHttp.get<BookSessionResponse>(
    ENDPOINTS.AI_CHAT.getSessions(userBookId),
  );

  return normalizeBookSessionData(response.data);
});

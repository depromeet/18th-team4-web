import { type BookSessionData, type BookSessionResponse } from './ai-chat.type';

export const DEFAULT_SESSION_TITLE = '아직 작성된 감상 기록이 없어요';

export const normalizeBookSessionData = (data: BookSessionResponse['data']): BookSessionData => ({
  book: data.book,
  sessions: data.sessions.map((session) => ({
    ...session,
    title: session.latestSummaryContent ?? DEFAULT_SESSION_TITLE,
    status: 'ACTIVE',
  })),
});

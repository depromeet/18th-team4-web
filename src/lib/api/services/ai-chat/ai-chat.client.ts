import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import {
  type BookSessionData,
  type BookSessionRequest,
  type BookSessionResponse,
  type CreateSessionRequest,
  type CreateSessionResponse,
  type SessionListRequest,
} from './ai-chat.type';

const normalizeBookSessionData = (data: BookSessionResponse['data']): BookSessionData => ({
  book: data.book,
  sessions: data.sessions.map((session) => ({
    ...session,
    title: session.latestSummaryContent ?? '아직 작성된 감상 기록이 없어요',
    status: 'ACTIVE',
  })),
});

export const getBookSessions = async (params: BookSessionRequest) => {
  const response = await publicHttp.get<BookSessionResponse>(
    ENDPOINTS.AI_CHAT.getSessions(params.userBookId),
  );

  return normalizeBookSessionData(response.data);
};

export const getSessions = async (params: SessionListRequest) => {
  const data = await getBookSessions({ userBookId: params.userBookId });

  return {
    sessions: data.sessions,
    page: params.page,
    size: data.sessions.length,
    hasNext: false,
  };
};

export const createSession = async (params: CreateSessionRequest) => {
  const response = await publicHttp.post<CreateSessionRequest, CreateSessionResponse>(
    ENDPOINTS.AI_CHAT.createSession(),
    params,
  );

  return response.data;
};

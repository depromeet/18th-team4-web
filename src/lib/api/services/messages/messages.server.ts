import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type MessagesData, type MessagesResponse } from './message.type';
import { MESSAGES_PAGE_SIZE } from './messages.constant';

/**
 * 서버 컴포넌트에서 메시지 첫 페이지를 가져온다(`?tab=chat` 진입 시 SSR 초기 데이터).
 * `getSummary`와 동일하게 `publicHttp`(쿠키 기반)로 호출한다.
 * 메시지 SSR 실패는 치명적이지 않으므로 null을 반환하고, 클라이언트가 탭 활성화 시 다시 가져온다.
 */
export const getMessagesFirstPage = async (sessionId: string): Promise<MessagesData | null> => {
  try {
    const query = new URLSearchParams({ page: '1', size: String(MESSAGES_PAGE_SIZE) });
    const response = await publicHttp.get<MessagesResponse>(
      `${ENDPOINTS.AI_CHAT.getMessages(sessionId)}?${query.toString()}`,
    );
    return response.data;
  } catch {
    return null;
  }
};

import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { HttpError, publicHttp } from '@/lib';
import { type SummaryData, type SummaryResponse } from './summary.type';

/**
 * SSR 감상문 조회. 요청 단위로 React.cache memoization.
 * 클라이언트 동작과 일관성을 맞추기 위해 409(생성 중)는 null을 반환한다.
 */
export const getSummary = cache(async (sessionId: string): Promise<SummaryData | null> => {
  try {
    const response = await publicHttp.get<SummaryResponse>(ENDPOINTS.AI_CHAT.getSummary(sessionId));
    return response.data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 409) {
      const code = error.errorCode?.toUpperCase();
      if (code === 'FAILED' || code === 'SUMMARY_FAILED') {
        throw error;
      }
      return null;
    }
    throw error;
  }
});

import { ENDPOINTS } from '@/constants';
import { HttpError, publicHttp } from '@/lib';
import { type SummaryData, type SummaryResponse } from './summary.type';

/**
 * 감상문 조회.
 * - 200: SummaryData 반환
 * - 409: 생성 중(IN_PROGRESS)/실패(FAILED). 본문에서 구분 가능한 안정 필드가 없으면
 *        polling 대상으로 두고 null 반환. FAILED가 명시적으로 식별되면 에러로 throw.
 * - 404: 직접 진입 또는 소유권 문제. 호출자에게 에러로 전달.
 * - 401/5xx: 그대로 throw.
 */
export const getSummary = async (sessionId: string): Promise<SummaryData | null> => {
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
};

/**
 * 감상문 초안 생성 요청.
 * - 202: 백그라운드 생성 시작
 * - 409: 이미 생성됨 → 성공으로 취급
 * - 422 등 그 외: 호출자가 status로 분기하도록 throw
 */
export const createSummaryDraft = async (sessionId: string): Promise<void> => {
  try {
    await publicHttp.post<void, void>(ENDPOINTS.AI_CHAT.createSummaryDraft(sessionId));
  } catch (error) {
    if (error instanceof HttpError && error.status === 409) {
      return;
    }
    throw error;
  }
};

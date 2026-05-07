import { ENDPOINTS } from '@/constants';
import { clientAuthHttp } from '@/lib/api/http/clientAuthHttp';
import { type SummaryEligibilityResponse } from './summary-eligibility.type';

export const checkSummaryEligibility = async (sessionId: string) => {
  const response = await clientAuthHttp.get<SummaryEligibilityResponse>(
    ENDPOINTS.AI_CHAT.checkSummaryEligibility(sessionId),
  );

  return response.data;
};

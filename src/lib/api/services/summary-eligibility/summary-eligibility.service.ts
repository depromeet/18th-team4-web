'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { checkSummaryEligibility } from './summary-eligibility.client';

export const useCheckSummaryEligibility = (sessionId: string) => {
  return useQuery({
    queryKey: QUERY_KEY.aiChat.summaryEligibility(sessionId),
    queryFn: () => checkSummaryEligibility(sessionId),
    enabled: !!sessionId,
  });
};

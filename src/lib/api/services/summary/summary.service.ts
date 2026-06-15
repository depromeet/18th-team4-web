'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { createSummaryDraft, getSummary, updateSummary } from './summary.client';
import { type SummaryData, type UpdateSummaryRequest } from './summary.type';

const SUMMARY_POLLING_INTERVAL_MS = 3000;

type UseSummaryOptions = {
  initialData?: SummaryData | null;
};

export const useSummary = (sessionId: string, options: UseSummaryOptions = {}) => {
  const { initialData } = options;

  return useQuery<SummaryData | null>({
    queryKey: QUERY_KEY.aiChat.summary(sessionId),
    queryFn: () => getSummary(sessionId),
    enabled: !!sessionId,
    initialData: initialData ?? undefined,
    staleTime: Infinity,
    refetchInterval: (query) => {
      if (query.state.data) return false;
      return SUMMARY_POLLING_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateSummaryDraft = () => {
  return useMutation({
    mutationFn: (sessionId: string) => createSummaryDraft(sessionId),
  });
};

export const useUpdateSummary = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateSummaryRequest) => updateSummary(sessionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.aiChat.summary(sessionId) });
    },
  });
};

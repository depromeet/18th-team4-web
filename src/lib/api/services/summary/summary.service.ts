'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { type SummaryDetail } from '../summaries/summaries.type';
import { createSummaryDraft, getSummary, updateSummary } from './summary.client';
import { type SummaryData, type UpdateSummaryRequest } from './summary.type';

const SUMMARY_POLLING_INTERVAL_MS = 2000;

type UseSummaryOptions = {
  initialData?: SummaryData | null;
  enabled?: boolean;
};

export const useSummary = (sessionId: string, options: UseSummaryOptions = {}) => {
  const { enabled = true, initialData } = options;

  return useQuery<SummaryData | null>({
    queryKey: QUERY_KEY.aiChat.summary(sessionId),
    queryFn: () => getSummary(sessionId),
    enabled: enabled && !!sessionId,
    initialData: initialData ?? undefined,
    staleTime: Infinity,
    retry: false,
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

export const useUpdateSummary = (sessionId: string, summaryId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateSummaryRequest) => updateSummary(sessionId, body),
    onSuccess: (_, body) => {
      if (summaryId) {
        queryClient.setQueryData<SummaryDetail | null>(
          QUERY_KEY.summaries.detail(summaryId),
          (summary) => ({
            aiChatSessionId: summary?.aiChatSessionId ?? Number(sessionId),
            title: body.title,
            body: body.body,
          }),
        );
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.aiChat.summary(sessionId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.summaries.all() });
    },
  });
};

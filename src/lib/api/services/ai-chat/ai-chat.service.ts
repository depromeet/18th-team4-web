'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { createSession, getBookSessions } from './ai-chat.client';

export const useGetSessions = (userBookId: number) => {
  return useQuery({
    queryKey: QUERY_KEY.aiChat.sessions(userBookId),
    queryFn: () => getBookSessions({ userBookId }),
    enabled: Number.isSafeInteger(userBookId) && userBookId > 0,
    staleTime: 0,
  });
};

export const useCreateSession = () => {
  return useMutation({
    mutationFn: (userBookId: number) => createSession({ userBookId }),
  });
};

'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { createSession, getSessions } from './ai-chat.client';

const SESSION_PAGE_SIZE = 50;

export const useGetSessions = (userBookId: number) => {
  return useQuery({
    queryKey: QUERY_KEY.aiChat.sessions(userBookId),
    queryFn: () => getSessions({ userBookId, page: 1, size: SESSION_PAGE_SIZE }),
    staleTime: 0,
  });
};

export const useCreateSession = () => {
  return useMutation({
    mutationFn: (userBookId: number) => createSession({ userBookId }),
  });
};

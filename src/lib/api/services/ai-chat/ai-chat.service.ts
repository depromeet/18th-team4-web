'use client';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { createSession, getSessions } from './ai-chat.client';

const SESSION_PAGE_SIZE = 7;

export const useGetSessions = (userBookId: number) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEY.aiChat.sessions(userBookId),
    queryFn: ({ pageParam }) =>
      getSessions({ userBookId, page: pageParam as number, size: SESSION_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    staleTime: 0,
  });
};

export const useCreateSession = () => {
  return useMutation({
    mutationFn: (userBookId: number) => createSession({ userBookId }),
  });
};

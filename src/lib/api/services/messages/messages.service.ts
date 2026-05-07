'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { getMessages } from './messages.client';

const MESSAGES_PAGE_SIZE = 20;

export const useGetMessages = (sessionId: string) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEY.aiChat.messages(sessionId),
    queryFn: ({ pageParam }) =>
      getMessages({ sessionId, page: pageParam as number, size: MESSAGES_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: !!sessionId,
  });
};

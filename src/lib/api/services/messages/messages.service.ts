'use client';

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { type MessagesData } from './message.type';
import { getMessages } from './messages.client';
import { MESSAGES_PAGE_SIZE } from './messages.constant';

type UseGetMessagesOptions = {
  refetchOnMount?: boolean | 'always';
  staleTime?: number;
  enabled?: boolean;
  initialMessages?: MessagesData | null;
};

export const useGetMessages = (sessionId: string, options: UseGetMessagesOptions = {}) => {
  const { enabled, initialMessages, ...rest } = options;

  return useInfiniteQuery({
    queryKey: QUERY_KEY.aiChat.messages(sessionId),
    queryFn: ({ pageParam }) =>
      getMessages({ sessionId, page: pageParam as number, size: MESSAGES_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: (enabled ?? true) && !!sessionId,
    initialData: initialMessages
      ? ({ pages: [initialMessages], pageParams: [1] } satisfies InfiniteData<MessagesData, number>)
      : undefined,
    ...rest,
  });
};

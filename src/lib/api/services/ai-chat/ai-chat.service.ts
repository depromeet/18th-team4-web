'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { getSessions } from './ai-chat.client';

// 수정 필요
const SESSION_PAGE_SIZE = 10;

export const useGetSessions = (userBookId: number) => {
  return useQuery({
    queryKey: QUERY_KEY.aiChat.sessions(userBookId),
    queryFn: () => getSessions({ userBookId, page: 1, size: SESSION_PAGE_SIZE }),
  });
};

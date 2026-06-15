'use client';

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { getSummaries } from './summaries.client';
import { type SummaryListData } from './summaries.type';

export const useGetSummaries = (initialData?: SummaryListData | null, pageSize?: number) => {
  return useInfiniteQuery<
    SummaryListData,
    Error,
    InfiniteData<SummaryListData>,
    ReturnType<typeof QUERY_KEY.summaries.list>,
    number
  >({
    queryKey: QUERY_KEY.summaries.list(pageSize),
    queryFn: ({ pageParam }) => getSummaries({ page: pageParam, size: pageSize }),
    initialPageParam: 1,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    staleTime: 0,
  });
};

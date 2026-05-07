'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from './books.client';

const BOOKS_PAGE_SIZE = 10;

export const useBookSearch = (keyword: string) => {
  return useInfiniteQuery({
    queryKey: ['books', 'search', keyword],
    queryFn: ({ pageParam }) =>
      searchBooks({ keyword, page: pageParam as number, size: BOOKS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: keyword.trim().length > 0,
  });
};

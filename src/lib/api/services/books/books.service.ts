'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from './books.client';

const BOOKS_PAGE_SIZE = 10;
export const BOOK_SEARCH_MIN_CHARS = 2;

/** 한글 IME·호환 자모 등에서 code unit 길이만으로는 「한 글자」판별이 깨져서 grapheme 우선 카운트 */
export const countBookSearchKeywordUnits = (raw: string): number => {
  const t = raw.trim();
  if (t === '') return 0;
  try {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      return [...new Intl.Segmenter('ko', { granularity: 'grapheme' }).segment(t)].length;
    }
  } catch {
    // Intl 실패 시 code point 폴백
  }
  return [...t].length;
};

export const useBookSearch = (keyword: string) => {
  const units = countBookSearchKeywordUnits(keyword);

  return useInfiniteQuery({
    queryKey: ['books', 'search', keyword],
    queryFn: ({ pageParam }) =>
      searchBooks({ keyword, page: pageParam as number, size: BOOKS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: units >= BOOK_SEARCH_MIN_CHARS,
  });
};

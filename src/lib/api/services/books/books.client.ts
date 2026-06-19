import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type BookSearchRequest, type BookSearchResponse } from './books.type';

export const searchBooks = async (params: BookSearchRequest) => {
  const query = new URLSearchParams({
    keyword: params.keyword,
    page: String(params.page),
    size: String(params.size),
  });

  const response = await publicHttp.get<BookSearchResponse>(
    `${ENDPOINTS.BOOKS.search()}?${query.toString()}`,
  );

  return response.data;
};

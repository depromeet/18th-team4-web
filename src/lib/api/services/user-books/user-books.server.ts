import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type UserBookListRequest, type UserBookListResponse } from './user-books.type';

export const getUserBooksServer = cache(async (params: UserBookListRequest = {}) => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.size !== undefined) query.set('size', String(params.size));
  const queryString = query.toString();

  const response = await publicHttp.get<UserBookListResponse>(
    queryString ? `${ENDPOINTS.USER_BOOKS.list()}?${queryString}` : ENDPOINTS.USER_BOOKS.list(),
  );

  return {
    ...response.data,
    books:
      params.size !== undefined ? response.data.books.slice(0, params.size) : response.data.books,
  };
});

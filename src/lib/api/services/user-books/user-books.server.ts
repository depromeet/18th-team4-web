import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type UserBookListResponse } from './user-books.type';

export const getUserBooks = cache(async () => {
  const response = await publicHttp.get<UserBookListResponse>(ENDPOINTS.USER_BOOKS.list());

  return response.data;
});

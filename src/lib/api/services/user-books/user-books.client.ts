import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type AddUserBookRequest, type AddUserBookResponse } from './user-books.type';

export const addUserBook = async (body: AddUserBookRequest) => {
  const response = await publicHttp.post<AddUserBookRequest, AddUserBookResponse>(
    ENDPOINTS.USER_BOOKS.add(),
    body,
  );

  return response.data;
};

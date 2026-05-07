import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import {
  type AddUserBookRequest,
  type AddUserBookResponse,
  type UserBookListResponse,
} from './user-books.type';

export const getUserBooks = async () => {
  const response = await publicHttp.get<UserBookListResponse>(ENDPOINTS.USER_BOOKS.list());

  return response.data;
};

export const addUserBook = async (body: AddUserBookRequest) => {
  const response = await publicHttp.post<AddUserBookRequest, AddUserBookResponse>(
    ENDPOINTS.USER_BOOKS.add(),
    body,
  );

  return response.data;
};

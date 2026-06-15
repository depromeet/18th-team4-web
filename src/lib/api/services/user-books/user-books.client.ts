import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import {
  type AddUserBookRequest,
  type AddUserBookResponse,
  type DeleteUserBookRequest,
  type UserBookListRequest,
  type UserBookListResponse,
} from './user-books.type';

export const getUserBooks = async (params: UserBookListRequest = {}) => {
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
};

export const deleteUserBook = async (params: DeleteUserBookRequest) => {
  await publicHttp.delete<unknown>(ENDPOINTS.USER_BOOKS.delete(params.userBookId));
};

export const addUserBook = async (body: AddUserBookRequest) => {
  const response = await publicHttp.post<AddUserBookRequest, AddUserBookResponse>(
    ENDPOINTS.USER_BOOKS.add(),
    body,
  );

  return response.data;
};

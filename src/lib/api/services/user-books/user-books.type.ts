import z from 'zod';
import {
  AddUserBookRequestSchema,
  AddUserBookResponseSchema,
  DeleteUserBookRequestSchema,
  UserBookDataSchema,
  UserBookItemSchema,
  UserBookListDataSchema,
  UserBookListRequestSchema,
  UserBookListResponseSchema,
} from './user-books.zod';

export type AddUserBookRequest = z.infer<typeof AddUserBookRequestSchema>;
export type AddUserBookResponse = z.infer<typeof AddUserBookResponseSchema>;
export type DeleteUserBookRequest = z.infer<typeof DeleteUserBookRequestSchema>;
export type UserBookData = z.infer<typeof UserBookDataSchema>;
export type UserBookItem = z.infer<typeof UserBookItemSchema>;
export type UserBookListData = z.infer<typeof UserBookListDataSchema>;
export type UserBookListRequest = z.infer<typeof UserBookListRequestSchema>;
export type UserBookListResponse = z.infer<typeof UserBookListResponseSchema>;

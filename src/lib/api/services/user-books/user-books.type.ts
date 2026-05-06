import z from 'zod';
import {
  AddUserBookRequestSchema,
  AddUserBookResponseSchema,
  UserBookDataSchema,
} from './user-books.zod';

export type AddUserBookRequest = z.infer<typeof AddUserBookRequestSchema>;
export type AddUserBookResponse = z.infer<typeof AddUserBookResponseSchema>;
export type UserBookData = z.infer<typeof UserBookDataSchema>;

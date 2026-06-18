import z from 'zod';
import { createResponseSchema } from '@/lib';

export const AddUserBookRequestSchema = z.object({
  bookExternalId: z.string().min(1),
});

export const DeleteUserBookRequestSchema = z.object({
  userBookId: z.number().int().positive(),
});

export const UserBookListRequestSchema = z.object({
  page: z.number().int().min(1).optional(),
  size: z.number().int().min(1).optional(),
});

export const UserBookDataSchema = z.object({
  id: z.number(),
  userId: z.number(),
  bookExternalId: z.string(),
  title: z.string(),
  authors: z.string(),
  publisher: z.string(),
  publishedYear: z.number(),
  coverUrl: z.string(),
  createdAt: z.string(),
});

export const AddUserBookResponseSchema = createResponseSchema(UserBookDataSchema);

export const UserBookItemSchema = z.object({
  userBookId: z.number(),
  bookId: z.number(),
  bookExternalId: z.string().optional(),
  title: z.string(),
  publisher: z.string(),
  publishedYear: z.number(),
  coverUrl: z.string(),
  chatSessionCount: z.number(),
});

export const UserBookListDataSchema = z.object({
  books: z.array(UserBookItemSchema),
  page: z.number().optional(),
  size: z.number().optional(),
  hasNext: z.boolean().optional(),
});

export const UserBookListResponseSchema = createResponseSchema(UserBookListDataSchema);

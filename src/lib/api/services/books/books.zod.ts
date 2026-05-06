import z from 'zod';
import { createResponseSchema } from '@/lib/api/types';

export const BookItemSchema = z.object({
  coverUrl: z.string(),
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publishedYear: z.number(),
  isbn13: z.string(),
});

export const BookSearchDataSchema = z.object({
  books: z.array(BookItemSchema),
  totalResultCount: z.number(),
  page: z.number(),
  size: z.number(),
  hasNext: z.boolean(),
});

export const BookSearchResponseSchema = createResponseSchema(BookSearchDataSchema);

export const BookSearchRequestSchema = z.object({
  keyword: z.string().min(1),
  page: z.number().int().min(1),
  size: z.number().int().min(1),
});

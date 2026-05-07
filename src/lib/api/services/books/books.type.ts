import z from 'zod';
import {
  BookItemSchema,
  BookSearchDataSchema,
  BookSearchRequestSchema,
  BookSearchResponseSchema,
} from './books.zod';

export type BookItem = z.infer<typeof BookItemSchema>;
export type BookSearchData = z.infer<typeof BookSearchDataSchema>;
export type BookSearchResponse = z.infer<typeof BookSearchResponseSchema>;
export type BookSearchRequest = z.infer<typeof BookSearchRequestSchema>;

import z from 'zod';
import { createResponseSchema } from '@/lib';

export const AddUserBookRequestSchema = z.object({
  bookExternalId: z.string().min(1),
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

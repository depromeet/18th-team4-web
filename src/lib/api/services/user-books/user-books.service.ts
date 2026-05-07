'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { addUserBook, getUserBooks } from './user-books.client';

export const useGetUserBooks = () => {
  return useQuery({
    queryKey: QUERY_KEY.userBooks.list(),
    queryFn: getUserBooks,
  });
};

export const useAddUserBook = () => {
  return useMutation({
    mutationFn: (bookExternalId: string) => addUserBook({ bookExternalId }),
  });
};

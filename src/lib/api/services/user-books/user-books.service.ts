'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { addUserBook, deleteUserBook, getUserBooks } from './user-books.client';

export const useGetUserBooks = (size?: number) => {
  return useQuery({
    queryKey: QUERY_KEY.userBooks.list(size),
    queryFn: () => getUserBooks(size !== undefined ? { page: 1, size } : {}),
  });
};

export const useAddUserBook = () => {
  return useMutation({
    mutationFn: (bookExternalId: string) => addUserBook({ bookExternalId }),
  });
};

export const useDeleteUserBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userBookId: number) => deleteUserBook({ userBookId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.userBooks.all() });
    },
  });
};

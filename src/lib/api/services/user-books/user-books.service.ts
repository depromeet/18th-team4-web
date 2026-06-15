'use client';

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { addUserBook, deleteUserBook, getUserBooks } from './user-books.client';
import { type UserBookListData } from './user-books.type';

export const useGetUserBooks = (size?: number) => {
  return useQuery({
    queryKey: QUERY_KEY.userBooks.list(size),
    queryFn: () => getUserBooks(size !== undefined ? { page: 1, size } : {}),
  });
};

export const useGetInfiniteUserBooks = (
  initialData?: UserBookListData | null,
  pageSize?: number,
) => {
  return useInfiniteQuery<
    UserBookListData,
    Error,
    InfiniteData<UserBookListData>,
    ReturnType<typeof QUERY_KEY.userBooks.list>,
    number
  >({
    queryKey: QUERY_KEY.userBooks.list(pageSize),
    queryFn: ({ pageParam }) => getUserBooks({ page: pageParam, size: pageSize }),
    initialPageParam: 1,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNext ? (lastPage.page ?? allPages.length) + 1 : undefined,
    staleTime: 0,
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

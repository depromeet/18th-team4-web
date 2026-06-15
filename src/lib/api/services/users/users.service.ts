'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { patchLastSelectedUserBookId, updateNickname } from './users.client';

export const usePatchLastSelectedUserBook = () => {
  return useMutation({
    mutationFn: patchLastSelectedUserBookId,
  });
};

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNickname,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.users.profile() });
    },
  });
};

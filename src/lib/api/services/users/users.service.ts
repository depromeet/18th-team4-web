'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants';
import { patchLastSelectedUserBookId, updateNickname } from './users.client';
import { type UpdateNicknameRequest } from './users.type';

export const usePatchLastSelectedUserBook = () => {
  return useMutation({
    mutationFn: patchLastSelectedUserBookId,
  });
};

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateNicknameRequest) => updateNickname(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.users.profile() });
    },
  });
};

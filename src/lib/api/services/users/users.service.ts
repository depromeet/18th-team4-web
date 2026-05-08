'use client';

import { useMutation } from '@tanstack/react-query';
import { patchLastSelectedUserBookId } from './users.client';

export const usePatchLastSelectedUserBook = () => {
  return useMutation({
    mutationFn: patchLastSelectedUserBookId,
  });
};

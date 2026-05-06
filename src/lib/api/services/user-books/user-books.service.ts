'use client';

import { useMutation } from '@tanstack/react-query';
import { addUserBook } from './user-books.client';

export const useAddUserBook = () => {
  return useMutation({
    mutationFn: (bookExternalId: string) => addUserBook({ bookExternalId }),
  });
};

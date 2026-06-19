'use client';

import { useMutation } from '@tanstack/react-query';
import { createChatSession } from './chat.client';

export const useCreateChatSession = () => {
  return useMutation({
    mutationFn: createChatSession,
  });
};

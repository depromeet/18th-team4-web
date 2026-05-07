'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createChatSession, streamChatMessage } from './chat.client';
import { type DoneEvent, type ErrorEvent } from './chat.type';

export const useCreateChatSession = () => {
  return useMutation({
    mutationFn: createChatSession,
  });
};

type UseSendMessageCallbacks = {
  onToken?: (delta: string, accumulated: string) => void;
  onDone?: (data: DoneEvent, accumulated: string) => void;
  onError?: (data: ErrorEvent) => void;
};

export const useSendMessage = (sessionId: string) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const send = async (content: string, callbacks: UseSendMessageCallbacks = {}) => {
    setIsStreaming(true);
    setStreamingContent('');

    let accumulated = '';

    try {
      await streamChatMessage(sessionId, content, {
        onToken: (delta) => {
          accumulated += delta;
          setStreamingContent(accumulated);
          callbacks.onToken?.(delta, accumulated);
        },
        onDone: (data) => {
          setIsStreaming(false);
          setStreamingContent('');
          callbacks.onDone?.(data, accumulated);
        },
        onError: (data) => {
          setIsStreaming(false);
          setStreamingContent('');
          callbacks.onError?.(data);
        },
      });
    } catch {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  return { send, isStreaming, streamingContent };
};

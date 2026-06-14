'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Header, HEADER_VARIANT, Modal, ReadumMarkLoadingIcon, TextfieldChat } from '@/components';
import { CHAT_BG_VARIANT, CHAT_USER, type ChatMessage, PATH_NAME, QUERY_KEY } from '@/constants';
import { useModal } from '@/hooks';
import {
  HttpError,
  streamChatMessage,
  useCheckSummaryEligibility,
  useCreateSummaryDraft,
  useGetMessages,
  usePendingChatStore,
  useToastStore,
} from '@/lib';
import { Chat } from './Chat';

const chatMatchesHistory = (history: ChatMessage, pending: ChatMessage) =>
  pending.id === history.id ||
  (pending.user === history.user && pending.message === history.message);

/**
 * 서버 히스토리 tail과 동일한 접두를 가진 optimistic 메시지는 목록에서 제외한다.
 * (같은 내용이지만 id가 다른 USER 메시지도 순서 기준으로 매칭)
 */
const stripPendingSyncedWithHistoryTail = (
  history: ChatMessage[],
  pending: ChatMessage[],
): ChatMessage[] => {
  if (pending.length === 0) return pending;

  const max = Math.min(history.length, pending.length);
  for (let k = max; k >= 1; k--) {
    let matches = true;
    for (let i = 0; i < k; i++) {
      const h = history[history.length - k + i];
      const p = pending[i];
      if (!chatMatchesHistory(h, p)) {
        matches = false;
        break;
      }
    }
    if (matches) return pending.slice(k);
  }
  return pending;
};

const formatTime = (isoString: string): string =>
  new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const mapInfinitePagesToHistoryChats = (
  data:
    | {
        pages: Array<{
          messages: Array<{ id: string; role: string; content: string; createdAt: string }>;
        }>;
      }
    | undefined,
): ChatMessage[] => {
  if (!data?.pages?.length) return [];
  return [...data.pages]
    .reverse()
    .flatMap((page) => [...page.messages].reverse())
    .map((msg) => ({
      id: msg.id,
      user: msg.role === 'USER' ? CHAT_USER.ME : CHAT_USER.AI,
      message: msg.content,
      createdAt: msg.createdAt,
    }));
};

const ERROR_MESSAGES: Record<string, string> = {
  AI_QUOTA_EXHAUSTED: '오늘 대화 한도를 초과했어요. 내일 다시 시도해주세요.',
  AI_PROVIDER_ERROR: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_PROVIDER_TRANSIENT: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_STREAM_INTERRUPTED: '응답 중 연결이 끊겼어요. 다시 시도해주세요.',
};

export const ChatContainer = () => {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const queryClient = useQueryClient();
  const consumePendingMessage = usePendingChatStore((s) => s.consume);

  const { isOpen, mountKey, open, close } = useModal();
  const openToast = useToastStore((s) => s.openToast);
  const { mutateAsync: createSummaryDraft, isPending: isCreatingSummary } = useCreateSummaryDraft();
  const [isSummaryLeaving, setIsSummaryLeaving] = useState(false);

  const handleConfirmSummary = async () => {
    if (isCreatingSummary || isSummaryLeaving) return;
    setIsSummaryLeaving(true);
    try {
      await createSummaryDraft(sessionId);
      close();
      router.push(PATH_NAME.summary.detail(sessionId));
    } catch (error) {
      setIsSummaryLeaving(false);
      if (error instanceof HttpError && error.status === 422) {
        openToast({
          type: 'error',
          message: '대화가 더 필요해요. 조금 더 이야기를 나눠주세요.',
        });
        return;
      }
      openToast({ type: 'error', message: '요약을 시작하지 못했어요. 잠시 후 다시 시도해주세요.' });
    }
  };

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [newChats, setNewChats] = useState<ChatMessage[]>([]);

  const { data: eligibilityData, refetch: refetchEligibility } =
    useCheckSummaryEligibility(sessionId);
  const canSummarize = eligibilityData?.eligible ?? false;
  const progress = eligibilityData?.progressPercent ?? 0;

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useGetMessages(sessionId);

  const historyChats: ChatMessage[] = mapInfinitePagesToHistoryChats(messagesData);

  useEffect(() => {
    setNewChats((prev) => {
      const next = stripPendingSyncedWithHistoryTail(historyChats, prev);
      if (
        next.length === prev.length &&
        next.every((m, i) => m.id === prev[i]?.id && m.message === prev[i]?.message)
      ) {
        return prev;
      }
      return next;
    });
  }, [historyChats]);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const visiblePendingChats = stripPendingSyncedWithHistoryTail(historyChats, newChats);

  const GREETING_MESSAGE: ChatMessage = {
    id: 'initial-greeting',
    user: CHAT_USER.AI,
    message: '어떤 얘기부터 시작할까요?\n지금 떠오르는 생각들을 자유롭게 던져보세요.',
  };

  const baseChats = [...historyChats, ...visiblePendingChats];
  const firstIsAI = historyChats.length > 0 && historyChats[0].user === CHAT_USER.AI;
  const allChats = isFetched && !firstIsAI ? [GREETING_MESSAGE, ...baseChats] : baseChats;
  const lastAIIndex = allChats.reduce(
    (last, chat, i) => (chat.user === CHAT_USER.AI ? i : last),
    -1,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChats.length, streamingContent]);

  const handleSend = async (overrideText?: string) => {
    const trimmedMessage = (overrideText != null ? overrideText : message).trim();
    if (!trimmedMessage || isStreaming) return;

    if (overrideText == null) setMessage('');

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      user: CHAT_USER.ME,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };
    setNewChats((prev) => [...prev, userMessage]);

    setIsStreaming(true);
    setStreamingContent('');
    let accumulated = '';
    let streamFinished = false;

    try {
      await streamChatMessage(sessionId, trimmedMessage, {
        onToken: (delta) => {
          accumulated += delta;
          setStreamingContent(accumulated);
          return new Promise<void>((resolve) => setTimeout(resolve, 30));
        },
        onRetry: () => {
          accumulated = '';
          setStreamingContent('');
        },
        onDone: (data) => {
          streamFinished = true;
          setIsStreaming(false);
          setStreamingContent('');
          setNewChats((prev) => [
            ...prev,
            {
              id: String(data.messageId),
              user: CHAT_USER.AI,
              message: accumulated,
            },
          ]);
          void queryClient.invalidateQueries({ queryKey: QUERY_KEY.aiChat.messages(sessionId) });
        },
        onError: (data) => {
          streamFinished = true;
          setIsStreaming(false);
          setStreamingContent('');
          const errorMessage = ERROR_MESSAGES[data.code] ?? '오류가 발생했어요. 다시 시도해주세요.';
          setNewChats((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              user: CHAT_USER.AI,
              message: errorMessage,
            },
          ]);
        },
      });
    } catch {
      streamFinished = true;
      setIsStreaming(false);
      setStreamingContent('');
    } finally {
      if (!streamFinished) {
        setIsStreaming(false);
        setStreamingContent('');
        if (accumulated) {
          setNewChats((prev) => [
            ...prev,
            { id: crypto.randomUUID(), user: CHAT_USER.AI, message: accumulated },
          ]);
        }
      }
      if (!canSummarize) void refetchEligibility();
    }
  };

  const initialSentRef = useRef(false);
  useEffect(() => {
    if (initialSentRef.current) return;
    const initial = consumePendingMessage();
    if (!initial) return;
    initialSentRef.current = true;
    void handleSend(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-text-white pointer-events-none absolute inset-x-0 bottom-0 top-[30%]" />

      <div className="relative z-10 flex h-screen flex-col">
        <Header
          variant={HEADER_VARIANT.CHAT}
          summarizeActive={canSummarize}
          onBack={() => router.back()}
          progress={progress}
        />

        <main className="bg-text-white scrollbar-hide min-h-0 flex-1 overflow-y-auto px-[2.4rem] pb-48">
          <div className="flex flex-col gap-[2.8rem]">
            <div ref={topRef} />
            {allChats.map((chat, index) => (
              <Chat
                key={chat.id}
                user={chat.user}
                time={
                  chat.user === CHAT_USER.ME && chat.createdAt
                    ? formatTime(chat.createdAt)
                    : undefined
                }
                message={chat.message}
                showIcon={!isStreaming && index === lastAIIndex}
              />
            ))}
            {isStreaming && (
              <Chat user={CHAT_USER.AI} message={streamingContent} isStreaming showIcon />
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="bg-white/68 bg-gradient-footer absolute inset-x-0 bottom-0 z-20 rounded-t-[24px] border border-white/35 border-b-0 px-[2.4rem] py-8 shadow-[0_-10px_36px_-14px_rgba(23,28,27,0.06)] backdrop-blur-[42px] backdrop-saturate-125">
          <TextfieldChat
            bgVariant={CHAT_BG_VARIANT.WHITE}
            placeholder="오늘은 어떤 얘기를 해볼까요?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={handleSend}
          />
        </footer>
      </div>

      {isSummaryLeaving && !isOpen ? (
        <div
          aria-busy="true"
          aria-live="polite"
          className="fixed inset-0 z-101 flex flex-col items-center justify-center gap-[1.6rem] bg-dim backdrop-blur-sm"
        >
          <ReadumMarkLoadingIcon className="h-auto w-[7.3rem] animate-pulse text-text-white" />
          <p className="body2-bold px-[2.4rem] text-center text-text-white">
            요약 페이지로 이동 중이에요
          </p>
        </div>
      ) : null}
      <Modal
        key={mountKey}
        modalType="DELETE"
        isOpen={isOpen}
        onCancel={close}
        onConfirm={handleConfirmSummary}
      />
    </div>
  );
};

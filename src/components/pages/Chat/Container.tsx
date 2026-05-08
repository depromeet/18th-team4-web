'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Header, HEADER_VARIANT, TextfieldChat } from '@/components';
import { CHAT_BG_VARIANT, CHAT_USER, type ChatMessage, PATH_NAME } from '@/constants';
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
import { Modal } from './Modal';

const ERROR_MESSAGES: Record<string, string> = {
  AI_QUOTA_EXHAUSTED: '오늘 대화 한도를 초과했어요. 내일 다시 시도해주세요.',
  AI_PROVIDER_ERROR: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_PROVIDER_TRANSIENT: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_STREAM_INTERRUPTED: '응답 중 연결이 끊겼어요. 다시 시도해주세요.',
};

const Container = () => {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const consumePendingMessage = usePendingChatStore((s) => s.consume);

  const { isOpen, open, close } = useModal();
  const openToast = useToastStore((s) => s.openToast);
  const { mutateAsync: createSummaryDraft, isPending: isCreatingSummary } = useCreateSummaryDraft();

  const handleConfirmSummary = async () => {
    if (isCreatingSummary) return;
    try {
      await createSummaryDraft(sessionId);
      close();
      router.push(PATH_NAME.summary.detail(sessionId));
    } catch (error) {
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

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(sessionId);

  const historyChats: ChatMessage[] = [...(messagesData?.pages ?? [])]
    .reverse()
    .flatMap((page) => [...page.messages].reverse())
    .map((msg) => ({
      id: msg.id,
      user: msg.role === 'USER' ? CHAT_USER.ME : CHAT_USER.AI,
      message: msg.content,
    }));

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

  const allChats = [...historyChats, ...newChats];
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
      <div className="bg-gradient-chat pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex h-screen flex-col">
        <Header
          variant={HEADER_VARIANT.CHAT}
          summarizeActive={canSummarize}
          onBack={() => router.back()}
          onCta={open}
        />

        <main className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-[2.4rem] pb-48">
          <div className="flex flex-col gap-[2.8rem]">
            <div ref={topRef} />
            {allChats.map((chat, index) => (
              <Chat
                key={chat.id}
                user={chat.user}
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

        <footer className="bg-gradient-footer absolute inset-x-0 bottom-0 z-20 rounded-t-[24px] border border-border-white/30 border-b-0 px-[2.4rem] py-8 backdrop-blur-md">
          <TextfieldChat
            bgVariant={CHAT_BG_VARIANT.WHITE}
            placeholder="이야기를 나눠보세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={handleSend}
          />
        </footer>
      </div>

      <Modal
        isOpen={isOpen}
        isConfirming={isCreatingSummary}
        onCancel={close}
        onConfirm={handleConfirmSummary}
      />
    </div>
  );
};

export default Container;

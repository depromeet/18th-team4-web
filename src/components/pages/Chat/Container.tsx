'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  AnimateTooltip,
  Header,
  HEADER_VARIANT,
  SummarizeModal,
  TextfieldChat,
} from '@/components';
import {
  CHAT_BG_VARIANT,
  CHAT_STATUS,
  CHAT_USER,
  type ChatMessage,
  PATH_NAME,
  QUERY_KEY,
} from '@/constants';
import { useModal } from '@/hooks';
import {
  formatChatTime,
  streamChatMessage,
  useCheckSummaryEligibility,
  useGetMessages,
  usePendingChatStore,
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
    }))
    .filter((chat, index, chats) => chats.findIndex((item) => item.id === chat.id) === index);
};

const ERROR_MESSAGES: Record<string, string> = {
  USER_RATE_LIMIT_EXCEEDED: '요청이 잠시 많아요. 조금 뒤에 다시 시도해주세요.',
  AI_QUOTA_EXHAUSTED: '오늘 대화 한도를 초과했어요. 내일 다시 시도해주세요.',
  AI_PROVIDER_ERROR: '오류가 발생했어요. 다시 시도해주세요.',
  AI_PROVIDER_TRANSIENT: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_STREAM_INTERRUPTED: '응답 중 연결이 끊겼어요. 다시 시도해주세요.',
  GUARDRAIL_BLOCKED_INPUT:
    '현재 등록된 책과 연관이 없는 내용이에요. 연관된 내용으로 다시 시도해주세요.',
};

const SESSION_LIMIT_EXCEEDED_CODES = ['USER_RATE_LIMIT_EXCEEDED', 'AI_QUOTA_EXHAUSTED'] as const;

type SessionLimitExceededCode = (typeof SESSION_LIMIT_EXCEEDED_CODES)[number];

const isSessionLimitExceededCode = (code: string): code is SessionLimitExceededCode =>
  SESSION_LIMIT_EXCEEDED_CODES.includes(code as SessionLimitExceededCode);

const SESSION_LIMIT_MODAL_COPY: Record<SessionLimitExceededCode, ReactNode> = {
  USER_RATE_LIMIT_EXCEEDED: (
    <>
      이 세션에서 보낼 수 있는 요청을 모두 사용했어요. <br /> 잠시 후 다시 시도해주세요.
    </>
  ),
  AI_QUOTA_EXHAUSTED: (
    <>
      오늘 대화 한도를 모두 사용했어요. <br /> 내일 다시 시도해주세요.
    </>
  ),
};

const CHAT_FOOTER_BASE_HEIGHT = 126;
const CHAT_BOTTOM_GAP = 16;

export const ChatContainer = () => {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const queryClient = useQueryClient();
  const consumePendingMessage = usePendingChatStore((s) => s.consume);

  const { isOpen, mountKey, open, close } = useModal();
  const {
    isOpen: isSessionLimitModalOpen,
    mountKey: sessionLimitModalMountKey,
    open: openSessionLimitModal,
    close: closeSessionLimitModal,
  } = useModal();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [message, setMessage] = useState('');
  const [newChats, setNewChats] = useState<ChatMessage[]>([]);
  const [footerHeight, setFooterHeight] = useState(160);
  const [showReadyTooltip, setShowReadyTooltip] = useState(false);
  const [sessionLimitExceededCode, setSessionLimitExceededCode] =
    useState<SessionLimitExceededCode | null>(null);

  const { data: eligibilityData, refetch: refetchEligibility } =
    useCheckSummaryEligibility(sessionId);
  const canSummarize = eligibilityData?.eligible ?? false;
  const progress = eligibilityData?.progressPercent ?? 0;
  const isChatInputDisabled = sessionLimitExceededCode !== null;
  const prevCanSummarizeRef = useRef(canSummarize);
  const extraFooterOffset = Math.max(0, footerHeight - CHAT_FOOTER_BASE_HEIGHT);

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

  useEffect(() => {
    if (canSummarize && !prevCanSummarizeRef.current) {
      setShowReadyTooltip(true);
    }

    prevCanSummarizeRef.current = canSummarize;
  }, [canSummarize]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const prevAllChatsLengthRef = useRef(0);
  const prevExtraFooterOffsetRef = useRef(0);

  const visiblePendingChats = stripPendingSyncedWithHistoryTail(historyChats, newChats);

  const handleCreateSummary = async () => {
    if (!canSummarize) return;

    router.push(PATH_NAME.summary.session(sessionId, undefined, true));
  };

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
    const footer = footerRef.current;
    if (!footer) return;

    const updateFooterHeight = () => {
      setFooterHeight(footer.getBoundingClientRect().height);
    };

    updateFooterHeight();

    const observer = new ResizeObserver(() => {
      updateFooterHeight();
    });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;

    const hasNewChat = allChats.length > prevAllChatsLengthRef.current;
    const footerOffsetChanged = extraFooterOffset !== prevExtraFooterOffsetRef.current;

    if (hasNewChat) {
      bottom.scrollIntoView({ behavior: 'smooth' });
    } else if (isStreaming || streamingContent || footerOffsetChanged) {
      bottom.scrollIntoView({ behavior: 'auto' });
    }

    prevAllChatsLengthRef.current = allChats.length;
    prevExtraFooterOffsetRef.current = extraFooterOffset;
  }, [allChats.length, extraFooterOffset, isStreaming, streamingContent]);

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
          if (data.code === 'SESSION_LOCKED') {
            open();
            void refetchEligibility();
            return;
          }
          if (isSessionLimitExceededCode(data.code)) {
            setSessionLimitExceededCode(data.code);
            openSessionLimitModal();
          }
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
          onBack={() => router.replace(PATH_NAME.main())}
          progress={progress}
          showProgressTooltip={!showReadyTooltip}
          rightSlot={
            canSummarize ? (
              <div className="relative flex shrink-0 flex-col items-end">
                <button
                  type="button"
                  onClick={handleCreateSummary}
                  className="body2-bold h-[3.2rem] shrink-0 cursor-pointer px-[0.4rem] text-text-default disabled:cursor-not-allowed disabled:text-text-disable"
                >
                  요약하기
                </button>
                {showReadyTooltip ? (
                  <div className="absolute right-0 top-[calc(100%+1.2rem)]">
                    <AnimateTooltip
                      arrowSide="top"
                      arrowAlignment="right"
                      content="이제부터 요약이 가능합니다!"
                      onClick={() => setShowReadyTooltip(false)}
                    />
                  </div>
                ) : null}
              </div>
            ) : null
          }
        />
        <div className="h-[2rem] bg-text-white shrink-0" />

        <main
          className="bg-text-white scrollbar-hide min-h-0 flex-1 overflow-y-auto px-[2.4rem] pt-[1.6rem]"
          style={{ paddingBottom: `${footerHeight + CHAT_BOTTOM_GAP}px` }}
        >
          <div ref={topRef} />
          <div className="flex flex-col gap-[2.8rem]">
            {allChats.map((chat, index) => (
              <Chat
                key={chat.id}
                user={chat.user}
                time={
                  chat.user === CHAT_USER.ME && chat.createdAt
                    ? formatChatTime(chat.createdAt)
                    : undefined
                }
                message={chat.message}
                showIcon={!isStreaming && index === lastAIIndex}
              />
            ))}
            {isStreaming && (
              <Chat user={CHAT_USER.AI} message={streamingContent} isStreaming showIcon />
            )}
            <div
              ref={bottomRef}
              style={{ scrollMarginBottom: `${extraFooterOffset + CHAT_BOTTOM_GAP}px` }}
            />
          </div>
        </main>

        <footer
          ref={footerRef}
          className="bg-white/68 bg-gradient-footer absolute inset-x-0 bottom-0 z-20 rounded-t-[24px] border border-white/35 border-b-0 px-[2.4rem] py-8 shadow-[0_-10px_36px_-14px_rgba(23,28,27,0.06)] backdrop-blur-[42px] backdrop-saturate-125"
        >
          <TextfieldChat
            bgVariant={CHAT_BG_VARIANT.WHITE}
            status={isChatInputDisabled ? CHAT_STATUS.DISABLED : CHAT_STATUS.DEFAULT}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={handleSend}
          />
        </footer>
      </div>

      {canSummarize && <SummarizeModal key={mountKey} isOpen={isOpen} onCancel={close} />}
      {sessionLimitExceededCode ? (
        <SummarizeModal
          key={sessionLimitModalMountKey}
          isOpen={isSessionLimitModalOpen}
          onCancel={closeSessionLimitModal}
          title="대화 한도를 초과했어요"
          description={SESSION_LIMIT_MODAL_COPY[sessionLimitExceededCode]}
        />
      ) : null}
    </div>
  );
};

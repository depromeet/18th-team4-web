'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TabView } from '@/components';
import { CHAT_USER, type ChatMessage, PATH_NAME, SUMMARY_TAB, type SummaryTab } from '@/constants';
import { useSummaryTab } from '@/hooks';
import {
  HttpError,
  type MessagesData,
  type SummaryData,
  type SummaryDetail,
  useCreateSummaryDraft,
  useGetMessages,
  useSummary,
  useSummaryDetail,
  useToastStore,
} from '@/lib';
import { SummaryChatHistory } from './SummaryChatHistory';
import { SummaryHeader } from './SummaryHeader';
import { SummaryLoading } from './SummaryLoading';
import { SummaryResult } from './SummaryResult';

type Props = {
  summaryId: string;
  sessionId: string;
  source?: 'detail' | 'session';
  shouldRequestDraft?: boolean;
  initialSummary: SummaryDetail | null;
  initialSessionSummary?: SummaryData | null;
  initialTab?: SummaryTab;
  initialMessages?: MessagesData | null;
};

export const SummaryContainer = (props: Props) => {
  const {
    summaryId,
    sessionId,
    source = 'detail',
    shouldRequestDraft = false,
    initialTab = SUMMARY_TAB.SUMMARY,
    initialSummary,
    initialSessionSummary,
    initialMessages,
  } = props;
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);
  const isSessionSource = source === 'session';
  const activeSessionId = isSessionSource ? summaryId : sessionId;
  const [isDraftRequestComplete, setIsDraftRequestComplete] = useState(!shouldRequestDraft);

  const { activeTab, changeTab } = useSummaryTab(
    summaryId,
    initialTab,
    isSessionSource ? 'session' : undefined,
  );

  const { data: detailSummary, isError: isDetailError } = useSummaryDetail(
    summaryId,
    initialSummary,
    !isSessionSource,
  );
  const {
    data: sessionSummary,
    isError: isSessionError,
    refetch: refetchSessionSummary,
  } = useSummary(activeSessionId, {
    enabled: isSessionSource && isDraftRequestComplete,
    initialData: initialSessionSummary,
  });
  const { mutateAsync: createSummaryDraftAsync } = useCreateSummaryDraft();
  const data = isSessionSource ? sessionSummary : detailSummary;
  const isError = isSessionSource ? isSessionError : isDetailError;
  const editableSummaryId = isSessionSource ? sessionSummary?.summaryId : Number(summaryId);
  const editHref = isSessionSource
    ? PATH_NAME.summary.edit(summaryId, 'session')
    : Number.isFinite(editableSummaryId)
      ? PATH_NAME.summary.edit(String(editableSummaryId))
      : undefined;
  const canShowEdit = activeTab === SUMMARY_TAB.SUMMARY && editHref !== undefined;

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isMessagesError,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useGetMessages(activeSessionId, {
    enabled: activeTab === SUMMARY_TAB.CHAT && !!activeSessionId,
    initialMessages,
    refetchOnMount: 'always',
  });

  const archivedChats: ChatMessage[] = [...(messagesData?.pages ?? [])]
    .reverse()
    .flatMap((page) => [...page.messages].reverse())
    .map((msg) => ({
      id: msg.id,
      user: msg.role === 'USER' ? CHAT_USER.ME : CHAT_USER.AI,
      message: msg.content,
      createdAt: msg.createdAt,
    }))
    .filter((chat, index, chats) => chats.findIndex((item) => item.id === chat.id) === index);

  const handledRef = useRef(false);
  const isDraftRequestingRef = useRef(false);

  useEffect(() => {
    if (!shouldRequestDraft || data || !activeSessionId || isDraftRequestingRef.current) return;

    const requestSummaryDraft = async () => {
      isDraftRequestingRef.current = true;

      try {
        await createSummaryDraftAsync(activeSessionId);
        setIsDraftRequestComplete(true);
        void refetchSessionSummary();
      } catch (error) {
        if (handledRef.current) return;

        handledRef.current = true;
        if (error instanceof HttpError && (error.status === 401 || error.status === 404)) {
          router.replace(PATH_NAME.main());
          return;
        }

        openToast({ type: 'error', message: '요약을 시작하지 못했어요. 다시 시도해주세요.' });
        router.replace(PATH_NAME.main());
      } finally {
        isDraftRequestingRef.current = false;
      }
    };

    void requestSummaryDraft();
  }, [
    activeSessionId,
    createSummaryDraftAsync,
    data,
    openToast,
    refetchSessionSummary,
    router,
    shouldRequestDraft,
  ]);

  useEffect(() => {
    if (handledRef.current) return;
    if (data) return;

    if (isError) {
      handledRef.current = true;
      openToast({ type: 'error', message: '요약을 불러오지 못했어요. 다시 시도해주세요.' });
      router.replace(PATH_NAME.main());
    }
  }, [data, isError, openToast, router]);

  if (!data) {
    return (
      <div className="flex h-dvh flex-col bg-background-primary-white">
        <SummaryHeader summaryId={summaryId} />
        <div className="fixed inset-0 flex w-full items-center justify-center px-[2.4rem]">
          <SummaryLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-background-primary-white">
      <SummaryHeader
        summaryId={String(editableSummaryId ?? summaryId)}
        editHref={canShowEdit ? editHref : undefined}
        showEdit={canShowEdit}
      />

      <main className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <TabView
          stickyHeader
          value={activeTab}
          onValueChange={changeTab}
          tabs={[
            {
              value: SUMMARY_TAB.SUMMARY,
              label: '요약',
              content: <SummaryResult title={data.title} body={data.body} />,
            },
            {
              value: SUMMARY_TAB.CHAT,
              label: 'AI 채팅',
              content: (
                <SummaryChatHistory
                  messages={archivedChats}
                  hasOlder={!!hasNextPage}
                  isFetchingOlder={isFetchingNextPage}
                  onLoadOlder={() => void fetchNextPage()}
                  isLoading={isMessagesLoading}
                  isError={isMessagesError}
                  onRetry={() => void refetchMessages()}
                />
              ),
            },
          ]}
        />
      </main>
    </div>
  );
};

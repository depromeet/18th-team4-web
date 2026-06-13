'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { TabView } from '@/components';
import { CHAT_USER, type ChatMessage, PATH_NAME, SUMMARY_TAB, type SummaryTab } from '@/constants';
import { useSummaryTab } from '@/hooks';
import {
  type MessagesData,
  type SummaryData,
  useGetMessages,
  useSummary,
  useToastStore,
} from '@/lib';
import { SummaryChatHistory } from './SummaryChatHistory';
import { SummaryHeader } from './SummaryHeader';
import { SummaryLoading } from './SummaryLoading';
import { SummaryResult } from './SummaryResult';

type Props = {
  sessionId: string;
  initialSummary: SummaryData | null;
  initialTab?: SummaryTab;
  initialMessages?: MessagesData | null;
};

export const SummaryContainer = (props: Props) => {
  const { sessionId, initialTab = SUMMARY_TAB.SUMMARY, initialSummary, initialMessages } = props;
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);

  const { activeTab, changeTab } = useSummaryTab(sessionId, initialTab);

  const { data, isError } = useSummary(sessionId, { initialData: initialSummary });

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isMessagesError,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useGetMessages(sessionId, {
    enabled: activeTab === SUMMARY_TAB.CHAT,
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
    }));

  const handledRef = useRef(false);

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
        <SummaryHeader summaryId={sessionId} />
        <div className="flex w-full px-[2.4rem] flex-1 items-center justify-center">
          <SummaryLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-background-primary-white">
      <SummaryHeader summaryId={sessionId} showEdit={activeTab === SUMMARY_TAB.SUMMARY} />

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

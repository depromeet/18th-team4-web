'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TabView } from '@/components';
import { CHAT_USER, type ChatMessage, PATH_NAME } from '@/constants';
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

type SummaryTab = 'summary' | 'chat';

type Props = {
  sessionId: string;
  initialSummary: SummaryData | null;
  initialTab?: SummaryTab;
  initialMessages?: MessagesData | null;
};

export const SummaryContainer = (props: Props) => {
  const { sessionId, initialTab = 'summary', initialSummary, initialMessages } = props;
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);

  const [activeTab, setActiveTab] = useState<SummaryTab>(initialTab);

  const handleTabChange = (next: string) => {
    const tab = next as SummaryTab;
    setActiveTab(tab);
    window.history.replaceState(null, '', PATH_NAME.summary.detail(sessionId, tab));
  };

  // 최초 진입 시 tab 파라미터가 없거나 유효하지 않으면 현재 탭 기준으로 URL을 정규화한다.
  useEffect(() => {
    window.history.replaceState(null, '', PATH_NAME.summary.detail(sessionId, initialTab));
  }, [sessionId, initialTab]);

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
    enabled: activeTab === 'chat',
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
        <SummaryHeader />
        <div className="flex w-full px-[2.4rem] flex-1 items-center justify-center">
          <SummaryLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-background-primary-white">
      <SummaryHeader />

      <main className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <TabView
          stickyHeader
          value={activeTab}
          onValueChange={handleTabChange}
          tabs={[
            {
              value: 'summary',
              label: '요약',
              content: <SummaryResult title={data.title} body={data.body} />,
            },
            {
              value: 'chat',
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

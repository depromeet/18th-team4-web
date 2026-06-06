'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TabView } from '@/components';
import { CHAT_USER, type ChatMessage, PATH_NAME } from '@/constants';
import { type SummaryData, useGetMessages, useSummary, useToastStore } from '@/lib';
import { SummaryChatHistory } from './SummaryChatHistory';
import { SummaryHeader } from './SummaryHeader';
import { SummaryLoading } from './SummaryLoading';
import { SummaryResult } from './SummaryResult';

type SummaryTab = 'summary' | 'chat';

type Props = {
  sessionId: string;
  initialSummary: SummaryData | null;
};

export const SummaryContainer = (props: Props) => {
  const { sessionId, initialSummary } = props;
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);

  const [activeTab, setActiveTab] = useState<SummaryTab>('summary');

  const { data, isError } = useSummary(sessionId, { initialData: initialSummary });

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(sessionId, { refetchOnMount: 'always' });

  const archivedChats: ChatMessage[] = [...(messagesData?.pages ?? [])]
    .reverse()
    .flatMap((page) => [...page.messages].reverse())
    .map((msg) => ({
      id: msg.id,
      user: msg.role === 'USER' ? CHAT_USER.ME : CHAT_USER.AI,
      message: msg.content,
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
      <div className="flex flex-col min-h-dvh">
        <SummaryHeader />
        <div className="flex w-full px-[2.4rem] flex-1 items-center justify-center">
          <SummaryLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background-primary-base">
      <SummaryHeader />

      <TabView
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SummaryTab)}
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
              />
            ),
          },
        ]}
      />
    </div>
  );
};

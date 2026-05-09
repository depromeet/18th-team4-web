'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { CHAT_CARD_COLOR, type ChatCardColor, chatCardGradientColor } from '@/components';
import { CHAT_USER, type ChatMessage, PATH_NAME } from '@/constants';
import { cn, type SummaryData, useGetMessages, useSummary, useToastStore } from '@/lib';
import { SummaryChatHistory } from './SummaryChatHistory';
import { SummaryHeader } from './SummaryHeader';
import { SummaryLoading } from './SummaryLoading';
import { SummaryResult, type SummarySection } from './SummaryResult';

const toSections = (data: SummaryData): SummarySection[] => {
  const sections: SummarySection[] = [{ heading: data.title, body: data.body }];
  if (data.quote) {
    sections.push({ heading: '인용', body: data.quote });
  }
  return sections;
};

type Props = {
  sessionId: string;
  initialSummary: SummaryData | null;
  color?: ChatCardColor;
};

export const SummaryContainer = (props: Props) => {
  const { sessionId, initialSummary, color = CHAT_CARD_COLOR.GREEN } = props;
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);

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

  const sections = toSections(data);

  return (
    <div className="flex flex-col min-h-dvh bg-background-primary-base">
      <SummaryHeader />

      <div className="relative isolate">
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 -bottom-100 h-200 -z-10',
            chatCardGradientColor[color],
          )}
        />
        <SummaryResult sections={sections} />
      </div>

      <SummaryChatHistory
        messages={archivedChats}
        hasOlder={!!hasNextPage}
        isFetchingOlder={isFetchingNextPage}
        onLoadOlder={() => void fetchNextPage()}
      />
    </div>
  );
};

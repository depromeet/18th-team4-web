'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { CHAT_CARD_COLOR } from '@/components';
import { PATH_NAME } from '@/constants';
import { type SummaryData, useSummary, useToastStore } from '@/lib';
import { SummaryCard, type SummarySection } from './SummaryCard';
import { SummaryHeader } from './SummaryHeader';
import { SummaryLoading } from './SummaryLoading';

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
};

export const SummaryContainer = (props: Props) => {
  const { sessionId, initialSummary } = props;
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);

  const { data, isError } = useSummary(sessionId, { initialData: initialSummary });

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
    <>
      <SummaryHeader />
      <section className="flex flex-col">
        <div className="px-[2.4rem]">
          <SummaryCard sections={sections} color={CHAT_CARD_COLOR.GREEN} />
        </div>
      </section>
    </>
  );
};

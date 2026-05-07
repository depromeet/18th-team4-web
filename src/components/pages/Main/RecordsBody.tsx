'use client';

import { useEffect, useRef } from 'react';
import {
  CHAT_CARD_COLOR_SEQUENCE,
  CHAT_CARD_STATUS,
  ChatCard,
  Header,
  HEADER_VARIANT,
  type ChatCardStatus,
} from '@/components';

type MockRecord = {
  id: number;
  date: string;
  summary?: string;
  status?: ChatCardStatus;
  bookmarked?: boolean;
};

const MOCK_RECORDS: MockRecord[] = [
  { id: 1, date: '25.10.10', summary: '대화한 내용 간단 요약 어쩌구 저쩌...' },
  { id: 2, date: '25.10.10', summary: '대화한 내용 간단 요약 어쩌구 저쩌...' },
  { id: 3, date: '25.10.10', summary: '대화한 내용 간단 요약 어쩌구 저쩌...' },
  { id: 4, date: '25.10.10', summary: '대화한 내용 간단 요약 어쩌구 저쩌...' },
  { id: 5, date: '25.10.10', status: CHAT_CARD_STATUS.LOADING },
  { id: 6, date: '25.10.10', summary: '대화한 내용 간단 요약 어쩌구 저쩌...', bookmarked: true },
];

export const RecordsBody = () => {
  const containerRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <main className="relative flex-1 flex flex-col bg-background-primary-base overflow-y-hidden">
      <Header variant={HEADER_VARIANT.HOME} className="absolute top-0 z-10" />
      <div className="flex-1" />
      <ol ref={containerRef} className="list-none relative flex flex-col overflow-y-auto py-[6.4rem]">
        {MOCK_RECORDS.map((record, index) => (
          <li key={record.id} className="mb-[-6.4rem]">
            <ChatCard
              color={CHAT_CARD_COLOR_SEQUENCE[(MOCK_RECORDS.length - 1 - index) % CHAT_CARD_COLOR_SEQUENCE.length]}
              status={record.status}
              date={record.date}
              summary={record.summary}
              bookmarked={record.bookmarked}
            />
          </li>
        ))}
      </ol>
    </main>
  );
};

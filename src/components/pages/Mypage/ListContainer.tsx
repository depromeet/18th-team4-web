'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  CHAT_CARD_COLOR_SEQUENCE,
  Header,
  HEADER_VARIANT,
  SummaryRecordCard,
  TabView,
} from '@/components';
import { PATH_NAME } from '@/constants';
import { BookCard } from './BookCard';
import { MOCK_BOOKS, MOCK_RECORDS } from './mockData';

export const MYPAGE_LIST_TAB = {
  REGISTERED: 'registered',
  RECORDS: 'records',
} as const;

type MypageListTab = (typeof MYPAGE_LIST_TAB)[keyof typeof MYPAGE_LIST_TAB];

const BooksGrid = () => (
  <ul className="animate-list-fill grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pb-[4rem] pt-[3.6rem]">
    {MOCK_BOOKS.map((book) => (
      <li key={book.id} className="flex min-w-0 flex-col">
        <BookCard book={book} />
      </li>
    ))}
  </ul>
);

const RecordsList = () => (
  <ul className="animate-list-fill flex list-none flex-col gap-[0.4rem] px-[2.4rem] pb-[4rem] pt-[2.4rem]">
    {MOCK_RECORDS.map((record, index) => {
      const color = CHAT_CARD_COLOR_SEQUENCE[index % CHAT_CARD_COLOR_SEQUENCE.length];

      return (
        <li key={record.id}>
          <SummaryRecordCard color={color} label={record.bookTitle} summary={record.summary} />
        </li>
      );
    })}
  </ul>
);

export const MypageListContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 진입 시 활성 탭은 ?tab= 쿼리로 결정한다(클라이언트에서 실제 주소창 값을 읽어 라우터 캐시 영향 없음).
  const [activeTab, setActiveTab] = useState<MypageListTab>(() =>
    searchParams.get('tab') === MYPAGE_LIST_TAB.RECORDS
      ? MYPAGE_LIST_TAB.RECORDS
      : MYPAGE_LIST_TAB.REGISTERED,
  );

  // 탭 전환 시 페이지 재이동(리마운트) 없이 URL의 tab 쿼리만 동기화한다.
  // → 슬라이드 애니메이션은 유지되고 주소창의 ?tab= 만 바뀐다.
  const handleTabChange = (next: string) => {
    setActiveTab(next as MypageListTab);
    window.history.replaceState(null, '', PATH_NAME.mypage.list(next));
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} className="bg-white" />

      <TabView
        value={activeTab}
        onValueChange={handleTabChange}
        tabs={[
          {
            value: MYPAGE_LIST_TAB.REGISTERED,
            label: '등록된 책',
            count: MOCK_BOOKS.length,
            content: <BooksGrid />,
          },
          {
            value: MYPAGE_LIST_TAB.RECORDS,
            label: '감상 기록',
            count: MOCK_RECORDS.length,
            content: <RecordsList />,
          },
        ]}
      />
    </div>
  );
};

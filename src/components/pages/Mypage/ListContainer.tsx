'use client';

import { useRouter } from 'next/navigation';
import { ChatCard, chatCardColorByIndex, Header, HEADER_VARIANT, TabView } from '@/components';
import { MYPAGE_TAB, PATH_NAME } from '@/constants';
import { useMypageTab } from '@/hooks';
import { BookCard } from './BookCard';
import { MOCK_BOOKS, MOCK_RECORDS } from './mockData';

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
    {MOCK_RECORDS.map((record, index) => (
      <li key={record.id}>
        <ChatCard
          color={chatCardColorByIndex(index)}
          bookTitle={record.bookTitle}
          summary={record.summary}
        />
      </li>
    ))}
  </ul>
);

export const MypageListContainer = () => {
  const router = useRouter();
  const { activeTab, changeTab } = useMypageTab(PATH_NAME.mypage.list);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} className="bg-white" />

      <TabView
        value={activeTab}
        onValueChange={changeTab}
        tabs={[
          {
            value: MYPAGE_TAB.REGISTERED,
            label: '등록된 책',
            count: MOCK_BOOKS.length,
            content: <BooksGrid />,
          },
          {
            value: MYPAGE_TAB.RECORDS,
            label: '감상 기록',
            count: MOCK_RECORDS.length,
            content: <RecordsList />,
          },
        ]}
      />
    </div>
  );
};

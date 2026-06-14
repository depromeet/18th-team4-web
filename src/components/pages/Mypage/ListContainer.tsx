'use client';

import { useRouter } from 'next/navigation';
import {
  ChatCard,
  chatCardColorByIndex,
  Empty,
  Header,
  HEADER_VARIANT,
  TabView,
} from '@/components';
import { MYPAGE_TAB, PATH_NAME } from '@/constants';
import { useMypageTab } from '@/hooks';
import { type SummaryListData, type UserBookListData } from '@/lib';
import { BookCard } from './BookCard';

type BooksGridProps = {
  initialBooks: UserBookListData | null;
};

const BooksGrid = (props: BooksGridProps) => {
  const { initialBooks } = props;
  const books = initialBooks?.books ?? [];

  return (
    <ul className="animate-list-fill grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pb-[4rem] pt-[3.6rem]">
      {books.length === 0 ? (
        <li className="col-span-2">
          <Empty title="등록된 책이 없습니다." description="책을 추가하고 대화를 시작해봐요!" />
        </li>
      ) : (
        books.map((book) => (
          <li key={book.userBookId} className="flex min-w-0 flex-col">
            <BookCard book={book} />
          </li>
        ))
      )}
    </ul>
  );
};

type RecordsListProps = {
  initialSummaries: SummaryListData | null;
};

const RecordsList = (props: RecordsListProps) => {
  const { initialSummaries } = props;
  const records = initialSummaries?.summaries ?? [];

  return (
    <ul className="animate-list-fill flex list-none flex-col gap-[0.4rem] px-[2.4rem] pb-[4rem] pt-[2.4rem]">
      {records.length === 0 ? (
        <li>
          <Empty
            title="등록된 감상 기록이 없습니다."
            description="채팅으로 감상 기록을 시작해봐요!"
          />
        </li>
      ) : (
        records.map((record, index) => (
          <li key={`${record.createdAt}-${record.bookTitle}-${index}`}>
            <ChatCard
              color={chatCardColorByIndex(index)}
              bookTitle={record.bookTitle}
              summary={record.content}
            />
          </li>
        ))
      )}
    </ul>
  );
};

type Props = {
  initialBooks: UserBookListData | null;
  initialSummaries: SummaryListData | null;
};

export const MypageListContainer = (props: Props) => {
  const { initialBooks, initialSummaries } = props;
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
            count: initialBooks?.books.length ?? 0,
            content: <BooksGrid initialBooks={initialBooks} />,
          },
          {
            value: MYPAGE_TAB.RECORDS,
            label: '감상 기록',
            count: initialSummaries?.summaries.length ?? 0,
            content: <RecordsList initialSummaries={initialSummaries} />,
          },
        ]}
      />
    </div>
  );
};

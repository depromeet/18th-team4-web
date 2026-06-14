'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  ChatCard,
  chatCardColorByIndex,
  Empty,
  Header,
  HEADER_VARIANT,
  Loading,
  TabView,
} from '@/components';
import { MYPAGE_TAB, PATH_NAME } from '@/constants';
import { useMypageTab } from '@/hooks';
import { type SummaryListData, useGetSummaries, type UserBookItem } from '@/lib';
import { BookCard } from './BookCard';

type BooksGridProps = {
  books: UserBookItem[];
};

const BooksGrid = (props: BooksGridProps) => {
  const { books } = props;

  return (
    <ul className="animate-list-fill grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pb-[4rem] pt-[3.6rem]">
      {books.map((book) => (
        <li key={book.userBookId} className="flex min-w-0 flex-col">
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
};

type RecordsListProps = {
  initialSummaries: SummaryListData | null;
};

const RecordsList = (props: RecordsListProps) => {
  const { initialSummaries } = props;
  const bottomSentinelRef = useRef<HTMLLIElement>(null);
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSummaries(initialSummaries);
  const records = (data?.pages ?? []).flatMap((page) => page.summaries);

  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <Loading />
      </div>
    );
  }

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
      <li ref={bottomSentinelRef} className="h-px" />
      {isFetchingNextPage && (
        <li className="flex min-h-[8rem]">
          <Loading />
        </li>
      )}
    </ul>
  );
};

type Props = {
  initialBooks: UserBookItem[];
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
            count: initialBooks.length,
            content: <BooksGrid books={initialBooks} />,
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

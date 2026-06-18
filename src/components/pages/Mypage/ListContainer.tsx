'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type RefObject, useEffect, useRef } from 'react';
import {
  ChatCard,
  chatCardColorByIndex,
  Empty,
  Header,
  HEADER_VARIANT,
  Loading,
  TabView,
} from '@/components';
import { MYPAGE_LIST_PAGE_SIZE, MYPAGE_TAB, PATH_NAME } from '@/constants';
import { useMypageTab } from '@/hooks';
import {
  type SummaryListData,
  useGetInfiniteUserBooks,
  useGetSummaries,
  type UserBookListData,
} from '@/lib';
import { BookCard } from './BookCard';

const useLoadMoreOnIntersect = (
  enabled: boolean,
  onLoadMore: () => void,
): RefObject<HTMLLIElement | null> => {
  const targetRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore();
      },
      { rootMargin: '16rem' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onLoadMore]);

  return targetRef;
};

type BooksGridProps = {
  initialBooks: UserBookListData | null;
  enabled: boolean;
};

const BooksGrid = (props: BooksGridProps) => {
  const { enabled, initialBooks } = props;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetInfiniteUserBooks(initialBooks, MYPAGE_LIST_PAGE_SIZE);
  const books = data?.pages.flatMap((page) => page.books) ?? [];
  const loadMoreRef = useLoadMoreOnIntersect(
    enabled && !!hasNextPage && !isFetchingNextPage,
    () => void fetchNextPage(),
  );

  if (isPending) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <Loading />
      </div>
    );
  }

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

      {hasNextPage && (
        <li
          ref={loadMoreRef}
          className="col-span-2 flex min-h-[5.6rem] items-center justify-center"
        >
          {isFetchingNextPage && <Loading />}
        </li>
      )}
    </ul>
  );
};

type RecordsListProps = {
  initialSummaries: SummaryListData | null;
  enabled: boolean;
};

const RecordsList = (props: RecordsListProps) => {
  const { enabled, initialSummaries } = props;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useGetSummaries(
    initialSummaries,
    MYPAGE_LIST_PAGE_SIZE,
  );
  const records = data?.pages.flatMap((page) => page.summaries) ?? [];
  const loadMoreRef = useLoadMoreOnIntersect(
    enabled && !!hasNextPage && !isFetchingNextPage,
    () => void fetchNextPage(),
  );

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
            <Link href={PATH_NAME.summary.detail(String(record.summaryId))} className="block">
              <ChatCard
                color={chatCardColorByIndex(index)}
                bookTitle={record.bookTitle}
                summary={record.sessionTitle}
              />
            </Link>
          </li>
        ))
      )}

      {hasNextPage && (
        <li ref={loadMoreRef} className="flex min-h-[5.6rem] items-center justify-center">
          {isFetchingNextPage && <Loading />}
        </li>
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
            content: (
              <BooksGrid
                initialBooks={initialBooks}
                enabled={activeTab === MYPAGE_TAB.REGISTERED}
              />
            ),
          },
          {
            value: MYPAGE_TAB.RECORDS,
            label: '감상 기록',
            count: initialSummaries?.summaries.length ?? 0,
            content: (
              <RecordsList
                initialSummaries={initialSummaries}
                enabled={activeTab === MYPAGE_TAB.RECORDS}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

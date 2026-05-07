'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Empty,
  Header,
  HEADER_VARIANT,
  ListItem,
  Loading,
  TextfieldSearch,
} from '@/components';
import { PATH_NAME } from '@/constants';
import { useDebouncing } from '@/hooks';
import { useAddUserBook, useBookSearch } from '@/lib';

const SEARCH_DEBOUNCE_MS = 500;

export const RegisterBody = () => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedIsbn, setSelectedIsbn] = useState<string | null>(null);

  const debouncedKeyword = useDebouncing(query, SEARCH_DEBOUNCE_MS, {
    onSettled: () => setSelectedIsbn(null),
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBookSearch(debouncedKeyword);

  const { mutate: addBook, isPending } = useAddUserBook();

  const books = data?.pages.flatMap((page) => page.books) ?? [];
  const isSettled = query.trim() === debouncedKeyword.trim();
  const hasQuery = query.trim().length > 0;
  const selectedBook = books.find((b) => b.isbn13 === selectedIsbn) ?? null;

  // 무한 스크롤 sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    if (next.trim() === '') setSelectedIsbn(null);
  };

  const flushSearch = () => {
    if (!query.trim()) return;
  };

  const handleRegister = () => {
    if (!selectedIsbn) return;
    addBook(selectedIsbn, {
      onSuccess: () => router.push(PATH_NAME.register.complete()),
    });
  };

  return (
    <>
      <Header variant={HEADER_VARIANT.BACK} className="shrink-0" onBack={() => router.back()} />

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <section className="shrink-0 px-[2.4rem] py-[0.8rem] text-text-default headline1-extrabold">
          어떤 책으로
          <br />
          대화를 나눠볼까요?
        </section>

        <section className="shrink-0 px-[2.4rem]">
          <TextfieldSearch
            value={query}
            onChange={handleChange}
            onSearch={flushSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                flushSearch();
              }
            }}
          />
        </section>

        {hasQuery && (
          <div className="flex min-h-0 flex-1 flex-col pt-[2.4rem]">
            <div className="flex min-h-0 flex-1 flex-col px-4 overflow-y-auto overscroll-y-contain">
              {/* 디바운스 대기 중 또는 로딩 */}
              {!isSettled || isLoading ? (
                <Loading />
              ) : books.length === 0 ? (
                <Empty />
              ) : (
                <>
                  <ul className="flex flex-col list-none">
                    {books.map((book, index) => (
                      <ListItem
                        key={book.isbn13 || index}
                        imageSrc={book.coverUrl}
                        imageAlt={`${book.title} 표지`}
                        title={book.title}
                        year={book.publishedYear}
                        publisher={book.publisher}
                        selected={selectedIsbn === book.isbn13}
                        onClick={() => setSelectedIsbn(book.isbn13)}
                      />
                    ))}
                  </ul>

                  {/* 무한 스크롤 트리거 */}
                  <div ref={sentinelRef} className="h-px" />

                  {isFetchingNextPage && <Loading />}
                </>
              )}
            </div>

            {selectedBook !== null && isSettled && (
              <section className="shrink-0 bg-primary-base px-[2.4rem] pt-[1.6rem] pb-[max(2.4rem,env(safe-area-inset-bottom))]">
                <Button
                  size="lg"
                  disabled={isPending}
                  onClick={handleRegister}
                  className="w-full rounded-[1.6rem]"
                >
                  {isPending ? '등록 중...' : '책 등록하기'}
                </Button>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
};

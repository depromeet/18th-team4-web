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
import {
  BOOK_SEARCH_MIN_CHARS,
  countBookSearchKeywordUnits,
  useAddUserBook,
  useBookSearch,
  useCreateSession,
} from '@/lib';

const SEARCH_DEBOUNCE_UI_MS = 500;
const SEARCH_DEBOUNCE_API_MS = 1000;

const SearchMinLengthHint = () => {
  return (
    <Empty title="검색어는 두 글자 이상 입력해주세요" description="책 제목으로 검색할 수 있어요" />
  );
};

export const RegisterBody = () => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedIsbn, setSelectedIsbn] = useState<string | null>(null);

  const debouncedKeywordUi = useDebouncing(query, SEARCH_DEBOUNCE_UI_MS);
  const debouncedKeywordApi = useDebouncing(query, SEARCH_DEBOUNCE_API_MS, {
    onSettled: () => setSelectedIsbn(null),
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBookSearch(debouncedKeywordApi);

  const { mutateAsync: addBookAsync, isPending: isAddingBook } = useAddUserBook();
  const { mutateAsync: createSessionAsync, isPending: isCreatingSession } = useCreateSession();

  const minKeywordUnits = BOOK_SEARCH_MIN_CHARS ?? 2;

  const booksRaw = data?.pages.flatMap((page) => page.books) ?? [];
  const trimmedQuery = query.trim();
  const trimmedUi = debouncedKeywordUi.trim();
  const trimmedApi = debouncedKeywordApi.trim();
  const isUiSettled = trimmedQuery === trimmedUi;
  const isApiSettled = trimmedQuery === trimmedApi;
  const hasQuery = trimmedQuery.length > 0;
  const queryUnits = countBookSearchKeywordUnits(trimmedQuery);

  /** UI 디바운스(500ms) 기준 최소 글자 미달 */
  const isBelowMinAfterUiDebounce =
    trimmedUi.length > 0 && countBookSearchKeywordUnits(trimmedUi) < minKeywordUnits;

  const debouncedHadSearchableUnits =
    trimmedApi.length > 0 && countBookSearchKeywordUnits(trimmedApi) >= minKeywordUnits;

  const books =
    isApiSettled &&
    debouncedHadSearchableUnits &&
    countBookSearchKeywordUnits(trimmedQuery) >= minKeywordUnits
      ? booksRaw
      : [];

  const selectedBook = books.find((b) => b.isbn13 === selectedIsbn) ?? null;

  const shouldShowButton =
    queryUnits >= minKeywordUnits && isUiSettled && isApiSettled && selectedBook !== null;

  const showWaitingUiDebounce = hasQuery && !isUiSettled;

  const showWaitingApiOrFetch =
    !showWaitingUiDebounce &&
    hasQuery &&
    !isBelowMinAfterUiDebounce &&
    (!isApiSettled || isLoading);

  const showHintAfterUi = !showWaitingUiDebounce && hasQuery && isBelowMinAfterUiDebounce;

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
    const t = next.trim();
    if (t === '' || countBookSearchKeywordUnits(t) < minKeywordUnits) setSelectedIsbn(null);
  };

  const flushSearch = () => {
    if (!query.trim()) return;
  };

  const isPending = isAddingBook || isCreatingSession;

  const handleRegister = async () => {
    if (!selectedIsbn) return;
    const registeredBook = await addBookAsync(selectedIsbn);
    const sessionData = await createSessionAsync(registeredBook.id);
    router.push(`${PATH_NAME.register.complete()}?sessionId=${sessionData.sessionId}`);
  };

  return (
    <>
      <Header
        variant={HEADER_VARIANT.BACK}
        className="shrink-0 bg-white"
        onBack={() => router.back()}
      />

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
          <div className="flex min-h-0 flex-1 flex-col pt-[2.4rem] pb-[1.6rem]">
            <div className="flex min-h-0 flex-1 flex-col px-4 overflow-y-auto overscroll-y-contain">
              {showWaitingUiDebounce ? (
                <Loading />
              ) : showHintAfterUi ? (
                <SearchMinLengthHint />
              ) : showWaitingApiOrFetch ? (
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
                        onClick={() =>
                          setSelectedIsbn((prev) => (prev === book.isbn13 ? null : book.isbn13))
                        }
                      />
                    ))}
                  </ul>

                  {/* 무한 스크롤 트리거 */}
                  <div ref={sentinelRef} className="h-px" />

                  {isFetchingNextPage && <Loading />}
                </>
              )}
            </div>

            {shouldShowButton && (
              <section className="btn-appear shrink-0 overflow-hidden bg-primary-base">
                <div className="px-[2.4rem] pt-[1.6rem] pb-[max(2.4rem,env(safe-area-inset-bottom))]">
                  <Button
                    size="lg"
                    disabled={isPending}
                    onClick={handleRegister}
                    className="w-full rounded-[1.6rem]"
                  >
                    {isPending ? '등록 중...' : '책 등록하기'}
                  </Button>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
};

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
  Modal,
  TextfieldSearch,
} from '@/components';
import { PATH_NAME } from '@/constants';
import { useDebouncing } from '@/hooks';
import {
  BOOK_SEARCH_MIN_CHARS,
  countBookSearchKeywordUnits,
  HttpError,
  setLastSelectedUserBookIdClient,
  useAddUserBook,
  useBookSearch,
  useCreateSession,
  useGetUserBooks,
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
  const [duplicateUserBookId, setDuplicateUserBookId] = useState<number | null>(null);

  const debouncedKeywordUi = useDebouncing(query, SEARCH_DEBOUNCE_UI_MS);
  const debouncedKeywordApi = useDebouncing(query, SEARCH_DEBOUNCE_API_MS, {
    onSettled: () => setSelectedIsbn(null),
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBookSearch(debouncedKeywordApi);
  const { data: userBooksData, refetch: refetchUserBooks } = useGetUserBooks();

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

  const findRegisteredUserBookId = async () => {
    if (!selectedBook) return null;

    const userBooks = ((await refetchUserBooks()).data ?? userBooksData)?.books ?? [];
    const registeredBook = userBooks.find(
      (book) =>
        book.bookExternalId === selectedBook.isbn13 ||
        (book.title === selectedBook.title &&
          book.publisher === selectedBook.publisher &&
          book.publishedYear === selectedBook.publishedYear),
    );

    return registeredBook?.userBookId ?? null;
  };

  const startChatWithBook = async (userBookId: number) => {
    const sessionData = await createSessionAsync(userBookId);
    setLastSelectedUserBookIdClient(userBookId);
    router.push(`${PATH_NAME.register.complete()}?sessionId=${sessionData.sessionId}`);
  };

  const handleRegister = async () => {
    if (!selectedIsbn) return;
    try {
      const registeredBook = await addBookAsync(selectedIsbn);
      await startChatWithBook(registeredBook.id);
    } catch (error) {
      const isDuplicateBookError =
        error instanceof HttpError &&
        (error.status === 409 || error.message.includes('이미 책장에 등록된 도서'));

      if (!isDuplicateBookError) {
        throw error;
      }

      const registeredUserBookId = await findRegisteredUserBookId();
      if (registeredUserBookId === null) {
        throw error;
      }

      setDuplicateUserBookId(registeredUserBookId);
    }
  };

  const handleDuplicateConfirm = () => {
    if (duplicateUserBookId === null) return;
    void startChatWithBook(duplicateUserBookId);
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

            <section
              className={`register-button-shell shrink-0 bg-white ${
                shouldShowButton
                  ? 'register-button-shell-open'
                  : 'register-button-shell-closed pointer-events-none select-none'
              }`}
              aria-hidden={!shouldShowButton}
            >
              <div className="register-button-content min-h-0 overflow-hidden px-[2.4rem] pt-[1.6rem] pb-[max(2.4rem,env(safe-area-inset-bottom))]">
                <Button
                  size="lg"
                  disabled={isPending || !shouldShowButton}
                  onClick={handleRegister}
                  className="w-full rounded-[1.6rem]"
                >
                  {isPending ? '등록 중...' : '책 등록하기'}
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>

      <Modal
        isOpen={duplicateUserBookId !== null}
        modalType="DUPLICATE_BOOK"
        onCancel={() => setDuplicateUserBookId(null)}
        onConfirm={handleDuplicateConfirm}
        confirmDisabled={isCreatingSession}
      />
    </>
  );
};

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/assets';
import { Empty, Header, HEADER_VARIANT, LinkButton, ListItem, TextfieldSearch } from '@/components';
import { PATH_NAME } from '@/constants';
import { useDebouncing } from '@/hooks';

type BookOption = {
  id: string;
  title: string;
  year: number;
  publisher: string;
};

const BOOK_OPTIONS: BookOption[] = [
  { id: '1', title: '해리포터와 마법사의 돌 1', year: 2007, publisher: '양재서' },
  { id: '6', title: '해리포터와 마법사의 돌 2', year: 2007, publisher: '양재서' },
  { id: '7', title: '해리포터와 마법사의 돌 3', year: 2007, publisher: '양재서' },
  { id: '8', title: '해리포터와 마법사의 돌 4', year: 2007, publisher: '양재서' },
  { id: '9', title: '해리포터와 마법사의 돌 5', year: 2007, publisher: '양재서' },
  { id: '10', title: '해리포터와 마법사의 돌 6', year: 2007, publisher: '양재서' },
  { id: '11', title: '해리포터와 마법사의 돌 7', year: 2007, publisher: '양재서' },
  { id: '2', title: '기사단장 죽이기', year: 2018, publisher: '신민규' },
  { id: '3', title: '불편한 편의점', year: 2020, publisher: '김가현' },
  { id: '4', title: '기묘한 이야기', year: 2026, publisher: '서지윤' },
  { id: '5', title: '메이저러너 시즌 1', year: 2014, publisher: '오승민' },
];

const SEARCH_DEBOUNCE_MS = 500;
const coverSrc = typeof Logo === 'string' ? Logo : Logo.src;

export const RegisterBody = () => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [appliedInner, setAppliedInner] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useDebouncing(query, SEARCH_DEBOUNCE_MS, {
    onSettled: (next) => {
      const settledTrimmed = next.trim();
      if (settledTrimmed === '') {
        setAppliedInner('');
        setSelectedId(null);
        return;
      }
      setAppliedInner(settledTrimmed);
      setSelectedId(null);
    },
  });

  const clickBack = () => router.back();

  const flushSearch = () => {
    const next = query.trim();
    if (!next) {
      return;
    }
    setAppliedInner(next);
    setSelectedId(null);
  };

  return (
    <>
      <Header variant={HEADER_VARIANT.BACK} className="shrink-0" onBack={clickBack} />

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <section className="shrink-0 px-[2.4rem] py-[0.8rem] text-text-default headline1-extrabold">
          어떤 책으로
          <br />
          대화를 나눠볼까요?
        </section>

        <section className="shrink-0 px-[2.4rem]">
          <TextfieldSearch
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              if (next.trim() === '') {
                setAppliedInner('');
                setSelectedId(null);
              }
            }}
            onSearch={flushSearch}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              flushSearch();
            }}
          />
        </section>

        {query.trim().length > 0 ? (
          <div className="flex min-h-0 flex-1 flex-col pt-[2.4rem]">
            <div className="flex min-h-0 flex-1 flex-col px-4 overflow-y-auto overscroll-y-contain">
              {query.trim() !== appliedInner ? null : BOOK_OPTIONS.filter(
                  (book) =>
                    appliedInner !== '' &&
                    book.title.toLowerCase().includes(appliedInner.toLowerCase()),
                ).length === 0 ? (
                <Empty />
              ) : (
                <ul className="flex flex-col list-none">
                  {BOOK_OPTIONS.filter(
                    (book) =>
                      appliedInner !== '' &&
                      book.title.toLowerCase().includes(appliedInner.toLowerCase()),
                  ).map((book) => (
                    <ListItem
                      key={book.id}
                      imageSrc={coverSrc}
                      imageAlt={`${book.title} 표지`}
                      title={book.title}
                      year={book.year}
                      publisher={book.publisher}
                      selected={selectedId === book.id}
                      onClick={() => setSelectedId(book.id)}
                    />
                  ))}
                </ul>
              )}
            </div>

            {Boolean(selectedId) &&
            query.trim() === appliedInner &&
            BOOK_OPTIONS.filter(
              (book) =>
                appliedInner !== '' &&
                book.title.toLowerCase().includes(appliedInner.toLowerCase()),
            ).some((book) => book.id === selectedId) ? (
              <section className="shrink-0 bg-primary-base px-[2.4rem] pt-[1.6rem] pb-[max(2.4rem,env(safe-area-inset-bottom))]">
                <LinkButton size="lg" href={PATH_NAME.register.complete()}>
                  책 등록하기
                </LinkButton>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

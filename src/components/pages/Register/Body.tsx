'use client';

import { useMemo, useState } from 'react';
import { LinkButton, ListItem, TextfieldSearch } from '@/components';
import { Logo } from '@/assets';
import { PATH_NAME } from '@/constants';

type BookOption = {
  id: string;
  title: string;
  year: number;
  publisher: string;
};

const BOOK_OPTIONS: BookOption[] = [
  { id: '1', title: '해리포터와 마법사의 돌 1', year: 2024, publisher: '문학수첩' },
  { id: '2', title: '해리포터와 마법사의 돌 1', year: 2024, publisher: '문학수첩' },
  { id: '3', title: '해리포터와 마법사의 돌 1', year: 2024, publisher: '문학수첩' },
  { id: '4', title: '해리포터와 마법사의 돌 1', year: 2024, publisher: '문학수첩' },
  { id: '5', title: '해리포터와 마법사의 돌 1', year: 2024, publisher: '문학수첩' },
];
const coverSrc = typeof Logo === 'string' ? Logo : Logo.src;

export default function RegisterBody() {
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const showResults = committedQuery.length > 0;

  const filteredBooks = useMemo(() => {
    if (!showResults) {
      return [];
    }
    const q = committedQuery.toLowerCase();
    return BOOK_OPTIONS.filter((book) => book.title.toLowerCase().includes(q));
  }, [committedQuery, showResults]);

  const runSearch = () => {
    const next = query.trim();
    if (!next) {
      return;
    }
    setCommittedQuery(next);
    setSelectedId(null);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <section className="shrink-0 px-[2.4rem] py-[0.8rem] text-text-default headline1-extrabold">
        어떤 책으로
        <br />
        대화를 나눠볼까요?
      </section>

      <section className="shrink-0 px-[2.4rem]">
        <TextfieldSearch
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={runSearch}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            runSearch();
          }}
        />
      </section>

      {showResults ? (
        <div className="flex min-h-0 flex-1 flex-col pt-[2.4rem]">
          <ul className="flex min-h-0 flex-1 list-none flex-col overflow-y-auto overscroll-y-contain px-4">
            {filteredBooks.map((book) => (
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

          <section className="shrink-0 bg-primary-base px-[2.4rem] pt-[1.6rem] pb-[max(2.4rem,env(safe-area-inset-bottom))]">
            <LinkButton size="lg" disabled={!selectedId} href={PATH_NAME.register.complete()}>
              책 등록하기
            </LinkButton>
          </section>
        </div>
      ) : null}
    </div>
  );
}

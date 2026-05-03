'use client';

import { Logo } from '@/assets';
import { BottomSheet, ChevronIcon, ListItem } from '@/components';
import { useState } from 'react';

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

const MainFooter = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(BOOK_OPTIONS[0]?.id ?? '');

  const clickSection = () => {
    setSheetOpen((prev) => !prev);
  };

  return (
    <>
      <BottomSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <section
            className="flex shrink-0 cursor-pointer select-none items-center gap-[0.2rem] px-[2.8rem] pt-[3.2rem] pb-[2.4rem]"
            onClick={() => {
              setSheetOpen(false);
            }}
          >
            <p className="headline2-extrabold text-text-default">해리 포터와 마법사의 돌 1</p>
            <ChevronIcon className="size-8 rotate-0 fill-[#595C5C] transition-transform duration-300 ease-in-out" />
          </section>
          <ul className="min-h-0 list-none flex-1 overflow-y-auto overscroll-contain">
            {BOOK_OPTIONS.map((book) => (
              <ListItem
                key={book.id}
                imageSrc={coverSrc}
                imageAlt={`${book.title} 표지`}
                title={book.title}
                year={book.year}
                publisher={book.publisher}
                selected={selectedId === book.id}
                onClick={() => {
                  setSelectedId(book.id);
                }}
              />
            ))}
          </ul>
        </div>
      </BottomSheet>

      <footer className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-150 -translate-x-1/2 flex-col gap-[1.8rem] bg-primary-base p-[2.8rem] pb-[max(2.8rem,env(safe-area-inset-bottom,0px))]">
        <section
          onClick={clickSection}
          className="flex cursor-pointer select-none items-center gap-[0.2rem]"
        >
          <p className="headline2-extrabold text-text-default">해리 포터와 마법사의 돌 1</p>
          <ChevronIcon
            className={`${sheetOpen ? 'rotate-0' : 'rotate-180'} size-8 fill-[#595C5C] transition-transform duration-300 ease-in-out`}
          />
        </section>
      </footer>
    </>
  );
};

export default MainFooter;

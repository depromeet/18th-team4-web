'use client';

import { Logo } from '@/assets';
import { BottomSheet, ChevronIcon, ListItem } from '@/components';
import { cn } from '@/lib';
import { useLayoutEffect, useRef, useState } from 'react';

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
  const headerRef = useRef<HTMLElement | null>(null);
  const [collapsedCap, setCollapsedCap] = useState('12rem');

  const selectedBook = BOOK_OPTIONS.find((b) => b.id === selectedId) ?? BOOK_OPTIONS[0];

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) {
      return;
    }
    const sync = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        setCollapsedCap(`${h}px`);
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  const clickSection = () => {
    setSheetOpen((prev) => !prev);
  };

  return (
    <BottomSheet
      open={sheetOpen}
      collapsedMaxHeight={collapsedCap}
      onClose={() => {
        setSheetOpen(false);
      }}
    >
      <div
        className={cn(
          'grid min-h-0 min-w-0 max-w-full flex-1 overflow-hidden transition-[grid-template-rows] duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          sheetOpen ? 'grid-rows-[auto_1fr]' : 'grid-rows-[auto_0fr]',
        )}
      >
        <section
          ref={headerRef}
          className="flex min-h-0 min-w-0 shrink-0 cursor-pointer select-none items-center gap-[0.2rem] bg-white px-[2.8rem] pt-[3.2rem] pb-[max(2.8rem,env(safe-area-inset-bottom,0px))]"
          onClick={clickSection}
        >
          <p className="headline2-extrabold text-text-default">
            {selectedBook?.title ?? '해리 포터와 마법사의 돌 1'}
          </p>
          <ChevronIcon
            className={cn(
              'size-8 fill-[#595C5C] transition-transform duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
              sheetOpen ? 'rotate-0' : 'rotate-180',
            )}
          />
        </section>
        <div className={cn('min-h-0 min-w-0 overflow-hidden', !sheetOpen && 'pointer-events-none')}>
          <ul
            className={cn(
              'h-full min-h-0 min-w-0 max-w-full list-none overflow-x-hidden overflow-y-auto overscroll-contain bg-primary-white',
              sheetOpen ? 'pb-[max(2.8rem,env(safe-area-inset-bottom,0px))]' : 'pb-0',
            )}
          >
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
      </div>
    </BottomSheet>
  );
};

export default MainFooter;

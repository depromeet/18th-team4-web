'use client';

import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/assets';
import { BottomSheet, ChevronIcon, ListItem, TextfieldChat } from '@/components';
import { cn } from '@/lib';

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

const COVER_SRC = typeof Logo === 'string' ? Logo : Logo.src;

export const MainFooter = () => {
  const peekRef = useRef<HTMLDivElement | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(BOOK_OPTIONS[0]?.id ?? '');
  const [collapsedCap, setCollapsedCap] = useState<string | undefined>(undefined);

  useEffect(() => {
    const el = peekRef.current;
    if (!el) {
      return;
    }

    const sync = () => {
      if (isSheetOpen) {
        return;
      }
      const h = el.offsetHeight;
      if (h > 0) {
        setCollapsedCap((prev) => {
          const next = `${h}px`;
          if (prev === undefined) {
            return next;
          }
          const prevN = Number.parseFloat(prev);
          if (Number.isNaN(prevN)) {
            return next;
          }
          // 전환 중 일시적으로 작은 높이면 cap을 줄이지 않음
          return h >= prevN * 0.92 ? next : prev;
        });
      }
    };

    sync();

    let rafOuter = 0;
    let rafInner = 0;
    rafOuter = requestAnimationFrame(() => {
      rafInner = requestAnimationFrame(sync);
    });

    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) {
          sync();
        }
      });
    }

    const ro = new ResizeObserver(sync);
    ro.observe(el);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      ro.disconnect();
    };
  }, [isSheetOpen]);

  const clickSection = () => {
    setIsSheetOpen((prev) => !prev);
  };

  return (
    <BottomSheet
      open={isSheetOpen}
      collapsedMaxHeight={collapsedCap}
      onClose={() => {
        setIsSheetOpen(false);
      }}
    >
      <div
        className={cn(
          'grid min-h-0 min-w-0 max-w-full flex-1 gap-y-0 overflow-hidden',
          'transition-[grid-template-rows] duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          isSheetOpen ? 'grid-rows-[auto_1fr]' : 'grid-rows-[auto_0fr]',
        )}
      >
        <div
          ref={peekRef}
          className={cn(
            'grid min-h-min min-w-0 grid-cols-1 gap-y-0 overflow-hidden',
            isSheetOpen ? 'grid-rows-[auto_0fr]' : 'grid-rows-[auto_auto]',
          )}
        >
          <button
            type="button"
            className={cn(
              'flex min-h-0 min-w-0 shrink-0 cursor-pointer select-none items-center gap-[0.2rem] bg-white px-[2.4rem]',
              isSheetOpen ? 'pt-[3.2rem] pb-[2.4rem]' : 'pt-[2.8rem]',
            )}
            onClick={clickSection}
          >
            <p className="headline2-extrabold text-text-default">해리 포터와 마법사의 돌 1</p>
            <ChevronIcon
              className={cn(
                'size-8 fill-[#595C5C] transition-transform duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
                isSheetOpen ? 'rotate-0' : 'rotate-180',
              )}
            />
          </button>

          <div
            className={cn(
              'min-h-0 w-full overflow-hidden px-[2.4rem] pt-[1.8rem] pb-[max(2.4rem,env(safe-area-inset-bottom,0px))]',
              isSheetOpen && 'hidden',
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
            role="presentation"
          >
            <TextfieldChat />
          </div>
        </div>

        <div
          className={cn(
            'relative z-10 min-h-0 min-w-0 overflow-hidden',
            isSheetOpen && 'bg-primary-white',
            !isSheetOpen && 'pointer-events-none',
          )}
        >
          <ul
            className={cn(
              'h-full min-h-0 min-w-0 max-w-full list-none overflow-x-hidden overflow-y-auto overscroll-contain bg-primary-white',
              isSheetOpen ? 'pb-[max(2.4rem,env(safe-area-inset-bottom,0px))]' : 'pb-0',
            )}
          >
            {BOOK_OPTIONS.map((book) => (
              <ListItem
                key={book.id}
                imageSrc={COVER_SRC}
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

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BottomSheet, ChevronIcon, ListItem, TextfieldChat } from '@/components';
import { PATH_NAME } from '@/constants';
import { cn, useCreateSession, usePendingChatStore, type UserBookItem } from '@/lib';

type Props = {
  books: UserBookItem[];
  selectedUserBookId: number;
  onSelectUserBook: (userBookId: number) => void;
};

export const MainFooter = (props: Props) => {
  const { books = [], selectedUserBookId, onSelectUserBook } = props;
  const router = useRouter();
  const { mutate: createSession } = useCreateSession();
  const peekRef = useRef<HTMLDivElement | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [collapsedCap, setCollapsedCap] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState('');

  const selectedBook = books.find((b) => b.userBookId === selectedUserBookId);
  const hasBooks = books.length > 0;

  const setPendingMessage = usePendingChatStore((s) => s.set);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setPendingMessage(trimmed);
    createSession(selectedUserBookId, {
      onSuccess: (data) => router.push(PATH_NAME.chat.detail(String(data.sessionId))),
    });
  };

  // 버튼 레이아웃 높이 계산
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
    if (!hasBooks) {
      return;
    }
    setIsSheetOpen((prev) => !prev);
  };

  return (
    <BottomSheet
      open={hasBooks && isSheetOpen}
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
          {/* 버튼 레이아웃: 책 없으면 토글 숨김 · 시트 열기 비활성 */}
          {hasBooks ? (
            <button
              type="button"
              className={cn(
                'flex min-h-0 min-w-0 shrink-0 cursor-pointer select-none items-center gap-[0.2rem] bg-white px-[2.4rem]',
                isSheetOpen ? 'pt-[3.2rem] pb-[2.4rem]' : 'pt-[2.8rem]',
              )}
              onClick={clickSection}
            >
              <p className="headline2-extrabold truncate text-text-default">{selectedBook?.title}</p>
              <ChevronIcon
                className={cn(
                  'size-8 fill-[#595C5C] transition-transform duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
                  isSheetOpen ? 'rotate-0' : 'rotate-180',
                )}
              />
            </button>
          ) : (
            <div
              className={cn(
                'flex min-h-0 min-w-0 shrink-0 cursor-default select-none items-center gap-[0.2rem] bg-white px-[2.4rem]',
                'pt-[2.8rem]',
              )}
              role="presentation"
            >
              <p className="headline2-extrabold truncate text-text-default">{selectedBook?.title}</p>
            </div>
          )}

          {/* 인풋 레이아웃 */}
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
            <TextfieldChat
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSend={handleSend}
            />
          </div>
        </div>

        {/* 목록 레이아웃 */}
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
            {books.map((book) => (
              <ListItem
                key={book.userBookId}
                imageSrc={book.coverUrl}
                imageAlt={`${book.title} 표지`}
                title={book.title}
                year={book.publishedYear}
                publisher={book.publisher}
                selected={selectedUserBookId === book.userBookId}
                onClick={() => {
                  onSelectUserBook(book.userBookId);
                  setIsSheetOpen(false);
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </BottomSheet>
  );
};

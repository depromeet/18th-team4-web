'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BottomSheet, ChevronIcon, ListItem, TextfieldChat } from '@/components';
import { CHAT_STATUS, PATH_NAME } from '@/constants';
import {
  cn,
  setLastSelectedUserBookIdClient,
  usePatchLastSelectedUserBook,
  usePendingChatStore,
  type UserBookItem,
} from '@/lib';

type Props = {
  books: UserBookItem[];
  selectedUserBookId: number;
  onSelectUserBook: (userBookId: number) => void;
};

export const MainFooter = (props: Props) => {
  const { books = [], selectedUserBookId, onSelectUserBook } = props;
  const router = useRouter();
  const { mutateAsync: patchLastSelected } = usePatchLastSelectedUserBook();
  const peekRef = useRef<HTMLDivElement | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [collapsedCap, setCollapsedCap] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState('');
  const [isNavigatingToChat, setIsNavigatingToChat] = useState(false);

  const selectedBook = books.find((b) => b.userBookId === selectedUserBookId);
  const hasBooks = books.length > 0;
  /** 한 권뿐이면 목록 선택·시트 오픈 불필요 — 내부 플래그와 무관하게 실제 노출 상태 */
  const hasMultipleBooks = books.length > 1;
  const sheetOpen = hasMultipleBooks && isSheetOpen;

  const setPendingMessage = usePendingChatStore((s) => s.set);
  const setPendingUserBookId = usePendingChatStore((s) => s.setUserBookId);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isNavigatingToChat) return;
    setIsNavigatingToChat(true);
    setPendingMessage(trimmed);
    setPendingUserBookId(selectedUserBookId);
    try {
      try {
        await patchLastSelected(selectedUserBookId);
      } catch {
        console.warn('[MainFooter] lastSelectedUserBookId 동기화 실패');
      }
      setLastSelectedUserBookIdClient(selectedUserBookId);
      router.push(PATH_NAME.chat.start());
    } catch {
      setIsNavigatingToChat(false);
      // 세션 생성 실패 시 상위(쿼리/토스트 등)에서 처리
    }
  };

  // 버튼 레이아웃 높이 계산
  useEffect(() => {
    const el = peekRef.current;
    if (!el) {
      return;
    }

    const sync = () => {
      if (sheetOpen) {
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
  }, [sheetOpen]);

  const clickSection = () => {
    if (!hasBooks || !hasMultipleBooks) {
      return;
    }
    setIsSheetOpen((prev) => !prev);
  };

  return (
    <BottomSheet
      open={sheetOpen}
      collapsedMaxHeight={collapsedCap}
      onClose={() => {
        setIsSheetOpen(false);
      }}
    >
      <div
        className={cn(
          'grid min-h-0 min-w-0 max-h-full max-w-full flex-1 gap-y-0 overflow-hidden',
          'transition-[grid-template-rows] duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          sheetOpen ? 'grid-rows-[auto_1fr]' : 'grid-rows-[auto_0fr]',
        )}
      >
        <div
          ref={peekRef}
          className={cn(
            'grid min-h-min min-w-0 grid-cols-1 gap-y-0 overflow-hidden',
            sheetOpen ? 'grid-rows-[auto_0fr]' : 'grid-rows-[auto_auto]',
          )}
        >
          {/* 버튼 레이아웃: 책 2권 이상만 토글·시트 — 1권·0권은 정적 제목만 */}
          {hasBooks && hasMultipleBooks ? (
            <button
              type="button"
              className={cn(
                'flex min-h-0 min-w-0 shrink-0 cursor-pointer select-none items-center gap-[0.2rem] bg-white px-[2.4rem]',
                sheetOpen ? 'pt-[3.2rem] pb-[2.4rem]' : 'pt-[2.8rem]',
              )}
              onClick={clickSection}
            >
              <p className="headline2-extrabold truncate text-text-default">
                {selectedBook?.title}
              </p>
              <ChevronIcon
                className={cn(
                  'size-8 fill-[#595C5C] transition-transform duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
                  sheetOpen ? 'rotate-0' : 'rotate-180',
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
              <p className="headline2-extrabold truncate text-text-default">
                {selectedBook?.title}
              </p>
            </div>
          )}

          {/* 인풋 레이아웃 */}
          <div
            className={cn(
              'min-h-0 w-full overflow-hidden px-[2.4rem] pt-[1.8rem] pb-[max(2.4rem,env(safe-area-inset-bottom,0px))]',
              sheetOpen && 'hidden',
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
            role="presentation"
          >
            <TextfieldChat
              status={isNavigatingToChat ? CHAT_STATUS.LOADING : CHAT_STATUS.DEFAULT}
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
            sheetOpen && 'bg-primary-white',
            !sheetOpen && 'pointer-events-none',
          )}
        >
          <ul
            className={cn(
              'h-full min-h-0 min-w-0 max-w-full list-none overflow-x-hidden overflow-y-auto overscroll-contain bg-primary-white',
              sheetOpen ? 'pb-[max(2.4rem,env(safe-area-inset-bottom,0px))]' : 'pb-0',
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

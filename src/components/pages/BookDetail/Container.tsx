'use client';

import Image, { type ImageProps } from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { emptyIcon, ExampleBook } from '@/assets';
import {
  CHAT_CARD_COLOR_SEQUENCE,
  CHAT_CARD_STATUS,
  ChatCard,
  Header,
  HEADER_VARIANT,
  Modal,
} from '@/components';
import { PATH_NAME } from '@/constants';
import { useModal } from '@/hooks';
import {
  type BookSessionData,
  formatDate,
  type SessionStatus,
  useDeleteUserBook,
  useToastStore,
} from '@/lib';

const SESSION_STATUS_TO_CARD: Record<
  SessionStatus,
  (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS]
> = {
  ACTIVE: CHAT_CARD_STATUS.DEFAULT,
  SUMMARIZING: CHAT_CARD_STATUS.LOADING,
  SUMMARIZED: CHAT_CARD_STATUS.DEFAULT,
  CLOSED: CHAT_CARD_STATUS.DEFAULT,
  FAILED: CHAT_CARD_STATUS.ERROR,
};

const getSessionPath = (sessionId: number, status: SessionStatus) => {
  if (status === 'ACTIVE') return PATH_NAME.chat.detail(String(sessionId));
  return PATH_NAME.summary.session(String(sessionId));
};

type BookCoverLightboxProps = {
  isOpen: boolean;
  src: ImageProps['src'];
  alt: string;
  onClose: () => void;
};

const BookCoverLightbox = (props: BookCoverLightboxProps) => {
  const { alt, isOpen, onClose, src } = props;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        dialogRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="책 표지 확대"
      tabIndex={-1}
      className="animate-[fade-in_0.2s_ease-out_both] fixed inset-0 z-modal flex cursor-zoom-out items-center justify-center bg-black/90 p-[2.4rem] outline-none"
      onClick={onClose}
    >
      <div className="animate-lightbox-zoom relative aspect-[104/154] h-auto max-h-[72dvh] w-[min(26rem,68vw)] overflow-hidden rounded-[1.6rem] shadow-[0_2.4rem_5.6rem_rgba(0,0,0,0.34)]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="68vw" priority />
      </div>
    </div>,
    document.body,
  );
};

type Props = {
  bookId: string;
  initialBookSessions: BookSessionData | null;
  fallbackCoverUrl?: string;
};

export const BookDetailContainer = (props: Props) => {
  const { bookId, fallbackCoverUrl = '', initialBookSessions } = props;
  const router = useRouter();
  const { isOpen, mountKey, open, close } = useModal();
  const { mutateAsync: deleteBook, isPending: isDeleting } = useDeleteUserBook();
  const openToast = useToastStore((s) => s.openToast);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const handleCloseCover = useCallback(() => setIsCoverOpen(false), []);
  const book = initialBookSessions?.book;
  const sessions = initialBookSessions?.sessions ?? [];
  const title = book?.title ?? '책 정보를 불러오지 못했어요';
  const publisherInfo = book ? `${book.publishedYear} | ${book.publisher}` : '';
  const coverUrl = book?.coverUrl?.trim() || fallbackCoverUrl.trim();

  const handleDeleteBook = async () => {
    if (isDeleting) return;
    const userBookId = Number(bookId);

    if (!Number.isSafeInteger(userBookId) || userBookId <= 0) {
      openToast({ type: 'error', message: '책 정보를 확인할 수 없어요.' });
      close();
      return;
    }

    try {
      await deleteBook(userBookId);
      close();
      router.push(PATH_NAME.mypage.main());
    } catch {
      openToast({ type: 'error', message: '책을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.' });
    }
  };

  return (
    <div data-book-id={bookId} className="flex min-h-dvh flex-col bg-white">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} className="bg-white" />

      <section className="flex items-start justify-between gap-[0.8rem] px-[2.4rem] py-[0.8rem]">
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="line-clamp-3 headline2-bold tracking-[-0.06rem] text-text-default">
            {title}
          </h1>
          {publisherInfo && (
            <p className="caption1-medium mt-[0.4rem] tracking-[-0.036rem] text-text-caption">
              {publisherInfo}
            </p>
          )}
          <button
            type="button"
            onClick={open}
            disabled={isDeleting}
            className="caption1-bold mt-[1.2rem] w-fit cursor-pointer rounded-[0.8rem] bg-gray-alpha-50 px-[1.2rem] py-[0.6rem] text-text-description"
          >
            책 삭제
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCoverOpen(true)}
          className="relative h-[15.4rem] w-[10.4rem] shrink-0 cursor-zoom-in overflow-hidden rounded-[1.2rem] border border-gray-alpha-100 transition-transform duration-300 ease-out active:scale-[0.96]"
          aria-label={`${title} 표지 확대`}
        >
          <Image
            src={coverUrl || ExampleBook}
            alt={title}
            fill
            className="object-cover"
            sizes="104px"
          />
        </button>
      </section>

      {sessions.length === 0 ? (
        <section className="flex flex-1 flex-col items-center px-[2.4rem] pt-[4.8rem] text-center">
          <Image src={emptyIcon} alt="" width={2408} height={2408} className="h-auto w-[22rem]" />
          <div className="mt-[2.8rem] flex flex-col items-center gap-[0.4rem]">
            <p className="title1-bold text-text-caption">등록된 감상 기록이 없습니다.</p>
            <p className="body2-medium text-text-disable">채팅으로 감상 기록을 시작해봐요!</p>
          </div>
        </section>
      ) : (
        <section className="flex flex-1 flex-col px-[2.4rem] pt-[2.4rem]">
          <ol className="flex list-none flex-col gap-[0.8rem] pb-[4rem]">
            {sessions.map((session, index) => {
              const color = CHAT_CARD_COLOR_SEQUENCE[index % CHAT_CARD_COLOR_SEQUENCE.length];
              const hasSummary = session.status === 'SUMMARIZED' || !!session.latestSummaryContent;
              const path = getSessionPath(session.sessionId, session.status);

              return (
                <li key={session.sessionId}>
                  <button
                    type="button"
                    className="w-full cursor-pointer text-left"
                    onClick={() => router.push(path)}
                  >
                    <ChatCard
                      color={color}
                      status={SESSION_STATUS_TO_CARD[session.status]}
                      date={formatDate(session.lastChattedDate)}
                      summary={session.title}
                      bookmarked={hasSummary}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <Modal
        key={mountKey}
        isOpen={isOpen}
        modalType="DELETE"
        onCancel={close}
        onConfirm={() => void handleDeleteBook()}
        confirmDisabled={isDeleting}
      />
      <BookCoverLightbox
        isOpen={isCoverOpen}
        src={coverUrl || ExampleBook}
        alt={title}
        onClose={handleCloseCover}
      />
    </div>
  );
};

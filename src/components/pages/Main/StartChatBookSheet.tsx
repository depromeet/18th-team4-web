'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BookCoverPlaceholder } from '@/assets';
import { BottomSheet, CheckIcon, CloseIcon } from '@/components';
import { cn, type UserBookItem } from '@/lib';

type Props = {
  open: boolean;
  books: UserBookItem[];
  selectedUserBookId?: number;
  onClose: () => void;
  onConfirm: (userBookId: number) => void;
};

type BookSelectItemProps = {
  book: UserBookItem;
  selected: boolean;
  onSelect: (userBookId: number) => void;
};

const BookSelectItem = (props: BookSelectItemProps) => {
  const { book, selected, onSelect } = props;
  const [loadFailed, setLoadFailed] = useState(false);

  const trimmedSrc = book.coverUrl.trim();
  const usePlaceholder = trimmedSrc.length === 0 || loadFailed;

  return (
    <li className="min-w-0">
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(book.userBookId)}
        className={cn(
          'flex w-full cursor-pointer items-center gap-[1.6rem] rounded-[2rem] px-[1.6rem] py-[1.8rem] text-left',
          selected && 'bg-gray-alpha-10',
        )}
      >
        <div className="relative h-[6.4rem] w-[5rem] shrink-0 overflow-hidden rounded-[0.6rem] border border-gray-alpha-100 shadow-[0px_0px_3.2rem_rgba(0,0,0,0.12)]">
          {usePlaceholder ? (
            <BookCoverPlaceholder
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          ) : (
            <Image
              src={trimmedSrc}
              alt={`${book.title} 표지`}
              fill
              className="pointer-events-none object-cover"
              onError={() => setLoadFailed(true)}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="title1-bold line-clamp-1 w-full break-words tracking-[-0.054rem] text-text-default">
            {book.title}
          </p>
          <p className="body2-medium tracking-[-0.042rem] text-text-caption">
            {book.publishedYear} | {book.publisher}
          </p>
        </div>

        {selected && (
          <span className="flex size-[2.8rem] shrink-0 items-center justify-center rounded-[0.8rem] bg-gray-900 drop-shadow-[0px_0px_16px_rgba(0,0,0,0.12)]">
            <CheckIcon className="size-[2.4rem] fill-white" />
          </span>
        )}
      </button>
    </li>
  );
};

export const StartChatBookSheet = (props: Props) => {
  const { open, books, onClose, onConfirm } = props;

  const [pickedId, setPickedId] = useState<number | undefined>();

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open && pickedId !== undefined) setPickedId(undefined);
  }

  const handleConfirm = () => {
    if (pickedId === undefined) {
      return;
    }
    onConfirm(pickedId);
  };

  const handleSelectBook = (userBookId: number) => {
    setPickedId((prev) => (prev === userBookId ? undefined : userBookId));
  };

  return (
    <BottomSheet open={open} collapsedMaxHeight="0px" onClose={onClose}>
      <div className="relative flex max-h-full min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between px-[2.4rem] pt-[3.2rem] pb-[2.4rem] border-b border-b-[#EEE]">
          <h2 className="headline2-extrabold tracking-[-0.06rem] text-text-default">
            어떤 책으로 대화를 나눌까요?
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex shrink-0 cursor-pointer items-center justify-center"
          >
            <CloseIcon className="size-[2.8rem] text-icon-quaternary" />
          </button>
        </div>

        <ul
          className={cn(
            'min-h-0 flex-1 list-none overflow-y-auto overscroll-contain px-[1rem] pt-[0.8rem]',
            pickedId === undefined ? 'pb-[2.4rem]' : 'pb-[11rem]',
          )}
        >
          {books.map((book) => (
            <BookSelectItem
              key={book.userBookId}
              book={book}
              selected={pickedId === book.userBookId}
              onSelect={handleSelectBook}
            />
          ))}
        </ul>

        {pickedId !== undefined && (
          <div className="btn-appear pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden bg-gradient-to-b from-transparent to-white to-[20%] px-[2.4rem] pt-[3.2rem] pb-[2.4rem]">
            <button
              type="button"
              onClick={handleConfirm}
              className="body1-bold pointer-events-auto w-full cursor-pointer rounded-[1.6rem] bg-gray-900 py-[1.8rem] text-center text-white"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

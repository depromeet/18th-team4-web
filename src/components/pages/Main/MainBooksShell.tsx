'use client';

import { useMemo, useState } from 'react';
import {
  getLastSelectedUserBookIdClient,
  setLastSelectedUserBookIdClient,
  usePatchLastSelectedUserBook,
  type UserBookItem,
} from '@/lib';
import { MainFooter } from './Footer';
import { RecordsBody } from './RecordsBody';

type Props = {
  books: UserBookItem[];
  initialSelectedUserBookId: number;
};

export const MainBooksShell = (props: Props) => {
  const { books, initialSelectedUserBookId } = props;
  const { mutate: persistLastSelectedBook } = usePatchLastSelectedUserBook();

  /** 시트에서 책 고를 때마다 증가 → useMemo가 sessionStorage를 다시 읽도록 */
  const [selectionEpoch, setSelectionEpoch] = useState(0);

  const selectedUserBookId = useMemo(() => {
    const fromClient = getLastSelectedUserBookIdClient(books);
    if (fromClient !== undefined) {
      return fromClient;
    }
    return initialSelectedUserBookId;
  }, [books, initialSelectedUserBookId, selectionEpoch]);

  const handleSelectUserBook = (userBookId: number) => {
    setLastSelectedUserBookIdClient(userBookId);
    setSelectionEpoch((n) => n + 1);
    persistLastSelectedBook(userBookId, {
      onError: () => {
        console.warn(
          '[MainBooksShell] lastSelectedUserBookId 동기화 실패 — 새로고침 시 선택이 유지 안 될 수 있음',
        );
      },
    });
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* book 전환 시 이전 책의 채팅 카드 상태·스크롤을 깨끗이 초기화 */}
      <RecordsBody key={selectedUserBookId} userBookId={selectedUserBookId} />
      <div className="mt-[10.2rem]" />
      <MainFooter
        books={books}
        selectedUserBookId={selectedUserBookId}
        onSelectUserBook={handleSelectUserBook}
      />
    </div>
  );
};

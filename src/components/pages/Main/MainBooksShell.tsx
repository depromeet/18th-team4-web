'use client';

import { useEffect, useState } from 'react';
import { usePatchLastSelectedUserBook, type UserBookItem } from '@/lib';
import { MainFooter } from './Footer';
import { RecordsBody } from './RecordsBody';

type Props = {
  books: UserBookItem[];
  initialSelectedUserBookId: number;
};

export const MainBooksShell = (props: Props) => {
  const { books, initialSelectedUserBookId } = props;
  const { mutate: persistLastSelectedBook } = usePatchLastSelectedUserBook();

  const [selectedUserBookId, setSelectedUserBookId] = useState(initialSelectedUserBookId);

  useEffect(() => {
    setSelectedUserBookId(initialSelectedUserBookId);
  }, [initialSelectedUserBookId]);

  const handleSelectUserBook = (userBookId: number) => {
    const previousId = selectedUserBookId;
    setSelectedUserBookId(userBookId);
    persistLastSelectedBook(userBookId, {
      onError: () => setSelectedUserBookId(previousId),
    });
  };

  return (
    <div className="flex h-dvh flex-col">
      <RecordsBody userBookId={selectedUserBookId} />
      <div className="mt-[10.2rem]" />
      <MainFooter
        books={books}
        selectedUserBookId={selectedUserBookId}
        onSelectUserBook={handleSelectUserBook}
      />
    </div>
  );
};

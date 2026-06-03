'use client';

import { getLastSelectedUserBookIdClient, type UserBookItem } from '@/lib';
import { RecordsBody } from './RecordsBody';

type Props = {
  books: UserBookItem[];
  initialSelectedUserBookId: number;
};

export const MainBooksShell = (props: Props) => {
  const { books, initialSelectedUserBookId } = props;

  const fromClient = getLastSelectedUserBookIdClient(books);
  const selectedUserBookId = fromClient !== undefined ? fromClient : initialSelectedUserBookId;

  return (
    <div className="flex h-dvh flex-col">
      <RecordsBody key={selectedUserBookId} userBookId={selectedUserBookId} />
    </div>
  );
};

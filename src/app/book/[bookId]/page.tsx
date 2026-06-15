import { type Metadata } from 'next';
import { BookDetailContainer } from '@/components';
import { getBookSessionsServer, getUserBooksServer } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:책 상세',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

type Props = {
  params: Promise<{ bookId: string }>;
};

const page = async (props: Props) => {
  const { bookId } = await props.params;
  const userBookId = Number(bookId);
  const [initialBookSessions, userBooksData] =
    Number.isSafeInteger(userBookId) && userBookId > 0
      ? await Promise.all([
          getBookSessionsServer(userBookId).catch(() => null),
          getUserBooksServer().catch(() => null),
        ])
      : [null, null];
  const fallbackBook = userBooksData?.books.find((book) => book.userBookId === userBookId) ?? null;

  return (
    <BookDetailContainer
      bookId={bookId}
      initialBookSessions={initialBookSessions}
      fallbackCoverUrl={fallbackBook?.coverUrl ?? ''}
    />
  );
};

export default page;

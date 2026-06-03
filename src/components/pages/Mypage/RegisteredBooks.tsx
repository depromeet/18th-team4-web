import { PATH_NAME } from '@/constants';
import { BookCard } from './BookCard';
import { MYPAGE_LIST_TAB } from './ListContainer';
import { MOCK_BOOKS, PREVIEW_COUNT } from './mockData';
import { MoreButton } from './MoreButton';

export const RegisteredBooks = () => {
  const previewBooks = MOCK_BOOKS.slice(0, PREVIEW_COUNT);
  const hasMore = MOCK_BOOKS.length > PREVIEW_COUNT;

  return (
    <div className="flex flex-col">
      <ul className="grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pt-[3.6rem]">
        {previewBooks.map((book) => (
          <li key={book.id} className="flex min-w-0 flex-col">
            <BookCard book={book} />
          </li>
        ))}
      </ul>

      {hasMore && <MoreButton href={PATH_NAME.mypage.list(MYPAGE_LIST_TAB.REGISTERED)} />}
    </div>
  );
};

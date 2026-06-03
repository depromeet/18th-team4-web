import { MYPAGE_TAB, PATH_NAME, PREVIEW_COUNT } from '@/constants';
import { MOCK_BOOKS } from '@/lib';
import { BookCard } from './BookCard';
import { MoreButton } from './MoreButton';

export const RegisteredBooks = () => {
  return (
    <div className="flex flex-col">
      <ul className="grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pt-[3.6rem]">
        {MOCK_BOOKS.slice(0, PREVIEW_COUNT).map((book) => (
          <li key={book.id} className="flex min-w-0 flex-col">
            <BookCard book={book} />
          </li>
        ))}
      </ul>

      {MOCK_BOOKS.length > PREVIEW_COUNT && (
        <MoreButton href={PATH_NAME.mypage.list(MYPAGE_TAB.REGISTERED)} />
      )}
    </div>
  );
};

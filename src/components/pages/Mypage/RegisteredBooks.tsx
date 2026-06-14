import { Empty } from '@/components';
import { MYPAGE_TAB, PATH_NAME, PREVIEW_COUNT } from '@/constants';
import { cn, type UserBookItem } from '@/lib';
import { BookCard } from './BookCard';
import { MoreButton } from './MoreButton';

type Props = {
  books: UserBookItem[];
};

export const RegisteredBooks = (props: Props) => {
  const { books } = props;
  const hasMoreBooks = books.length > PREVIEW_COUNT;

  if (books.length === 0) {
    return <Empty title="등록된 책이 없습니다." description="책을 추가하고 대화를 시작해봐요!" />;
  }

  return (
    <div className="flex flex-col">
      <ul
        className={cn(
          'grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pt-[3.6rem]',
          !hasMoreBooks && 'pb-[4rem]',
        )}
      >
        {books.slice(0, PREVIEW_COUNT).map((book) => (
          <li key={book.userBookId} className="flex min-w-0 flex-col">
            <BookCard book={book} />
          </li>
        ))}
      </ul>

      {hasMoreBooks && <MoreButton href={PATH_NAME.mypage.list(MYPAGE_TAB.REGISTERED)} />}
    </div>
  );
};

import Image from 'next/image';
import Link from 'next/link';
import { ExampleBook } from '@/assets';
import { PATH_NAME } from '@/constants';
import { cn } from '@/lib';
import { type RegisteredBook } from './mockData';

type Props = {
  book: RegisteredBook;
};

export const BookCard = (props: Props) => {
  const { book } = props;

  return (
    <Link href={PATH_NAME.book.detail(String(book.id))} className="flex min-w-0 flex-col">
      <div className="relative mx-auto h-[15.4rem] w-[10.4rem]">
        <div
          aria-hidden
          className="absolute inset-0 rotate-6 overflow-hidden rounded-[1.2rem] border border-gray-alpha-100 shadow-[0_0_3.2rem_rgba(0,0,0,0.12)]"
        >
          <Image
            src={ExampleBook}
            alt=""
            fill
            className="object-cover blur-[0.5rem]"
            sizes="104px"
          />
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-gray-alpha-100 shadow-[0_0_3.2rem_rgba(0,0,0,0.12)]">
          <Image src={ExampleBook} alt={book.title} fill className="object-cover" sizes="104px" />
        </div>
        <span
          className={cn(
            'body2-bold absolute right-0 top-0 flex size-[2.6rem] -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full text-center [text-shadow:0_0_1.125px_rgba(0,0,0,0.32)]',
            book.count === 0
              ? 'border border-gray-alpha-100 bg-gray-alpha-50 text-black shadow-[0_0_0.3rem_0_rgba(255,255,255,0.80)_inset] backdrop-blur-[0.5rem]'
              : 'bg-green-darkest text-text-white shadow-[0_0_0.3rem_0_rgba(255,255,255,0.80)_inset]',
          )}
        >
          {book.count}
        </span>
      </div>

      <p className="body2-bold mt-[1.6rem] w-full truncate text-center tracking-[-0.042rem] text-text-default">
        {book.title}
      </p>
      <p className="caption1-medium mt-[0.4rem] w-full truncate text-center tracking-[-0.036rem] text-text-caption">
        {`${book.year} | ${book.publisher}`}
      </p>
    </Link>
  );
};

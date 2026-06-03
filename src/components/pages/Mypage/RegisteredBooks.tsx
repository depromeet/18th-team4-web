import Image from 'next/image';
import { ExampleBook } from '@/assets';
import { MoreButton } from './MoreButton';

type RegisteredBook = {
  id: number;
  title: string;
  year: number;
  publisher: string;
  count: number;
};

const MOCK_BOOKS: RegisteredBook[] = [
  {
    id: 1,
    title: '셰익스피어의 영혼을 담아낸 평론집',
    year: 2024,
    publisher: '고전문학연구',
    count: 3,
  },
  {
    id: 2,
    title: '셰익스피어의 영혼을 담아낸 평론집',
    year: 2024,
    publisher: '고전문학연구',
    count: 0,
  },
  {
    id: 3,
    title: '셰익스피어의 영혼을 담아낸 평론집',
    year: 2024,
    publisher: '고전문학연구',
    count: 4,
  },
  {
    id: 4,
    title: '셰익스피어의 영혼을 담아낸 평론집',
    year: 2024,
    publisher: '고전문학연구',
    count: 12,
  },
];

export const RegisteredBooks = () => {
  return (
    <div className="flex flex-col">
      <ul className="grid list-none grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-[2.4rem] pt-[3.6rem]">
        {MOCK_BOOKS.map((book) => (
          <li key={book.id} className="flex min-w-0 flex-col">
            <div className="relative mx-auto h-[15.4rem] w-[10.4rem]">
              <div
                aria-hidden
                className="absolute inset-0 rotate-6 overflow-hidden rounded-[1.2rem] border border-gray-alpha-100 shadow-[0_0_3.2rem_rgba(0,0,0,0.12)]"
              >
                <Image src={ExampleBook} alt="" fill className="object-cover" sizes="104px" />
              </div>
              <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-gray-alpha-100 shadow-[0_0_3.2rem_rgba(0,0,0,0.12)]">
                <Image
                  src={ExampleBook}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="104px"
                />
              </div>
              <span className="body2-bold absolute right-0 top-0 flex size-[2.6rem] -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-green-darkest text-center text-text-white [text-shadow:0_0_1.125px_rgba(0,0,0,0.32)]">
                {book.count}
              </span>
            </div>

            <p className="body2-bold mt-[1.6rem] w-full truncate text-center tracking-[-0.042rem] text-text-default">
              {book.title}
            </p>
            <p className="caption1-medium mt-[0.4rem] w-full truncate text-center tracking-[-0.036rem] text-text-caption">
              {`${book.year} | ${book.publisher}`}
            </p>
          </li>
        ))}
      </ul>

      <MoreButton />
    </div>
  );
};

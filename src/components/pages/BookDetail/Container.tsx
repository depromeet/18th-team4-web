'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExampleBook } from '@/assets';
import { ChatCard, chatCardColorByIndex, Header, HEADER_VARIANT } from '@/components';
import { MOCK_BOOK_SUMMARIES } from '@/lib';

type Props = {
  bookId: string;
};

export const BookDetailContainer = (props: Props) => {
  const { bookId } = props;
  const router = useRouter();

  return (
    <div data-book-id={bookId} className="flex min-h-dvh flex-col bg-white">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} className="bg-white" />

      <section className="flex items-start justify-between gap-[0.8rem] px-[2.4rem] py-[0.8rem]">
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="headline2-bold tracking-[-0.06rem] text-text-default">
            괴테는 모든 것을 말했다
          </h1>
          <p className="caption1-medium mt-[0.4rem] tracking-[-0.036rem] text-text-caption">
            2024 | 고전문학연구
          </p>
          <button
            type="button"
            className="caption1-bold mt-[1.2rem] w-fit cursor-pointer rounded-[0.8rem] bg-gray-alpha-50 px-[1.2rem] py-[0.6rem] text-text-description"
          >
            책 삭제
          </button>
        </div>

        <div className="relative h-[15.4rem] w-[10.4rem] shrink-0 overflow-hidden rounded-[1.2rem] border border-gray-alpha-100">
          <Image
            src={ExampleBook}
            alt="괴테는 모든 것을 말했다"
            fill
            className="object-cover"
            sizes="104px"
          />
        </div>
      </section>

      <ul className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] py-[2.4rem]">
        {MOCK_BOOK_SUMMARIES.map((item, index) => (
          <li key={item.id}>
            <ChatCard color={chatCardColorByIndex(index)} date={item.date} summary={item.summary} />
          </li>
        ))}
      </ul>
    </div>
  );
};

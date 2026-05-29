import Image from 'next/image';
import { emptyIcon } from '@/assets';

export const EmptyRecordsBody = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="relative h-[22.5rem] w-[26.7rem] shrink-0 overflow-hidden">
        <Image
          src={emptyIcon}
          alt="대화 없음"
          width={301}
          height={301}
          className="absolute right-[-1.694rem] top-[-1.694rem] w-[30.088rem]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-[11.6rem] bg-linear-to-b from-transparent to-white" />
      </div>
      <p className="title1-bold bg-linear-to-r from-text-default to-green-primary bg-clip-text text-center tracking-[-0.054rem] text-transparent">
        첫 대화를 시작해볼까요?
      </p>
    </main>
  );
};

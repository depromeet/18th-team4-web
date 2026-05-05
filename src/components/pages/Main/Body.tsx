import Image from 'next/image';
import { HomeLogo } from '@/assets';

export const MainBody = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-[4.8rem] px-[2.4rem]">
      <h1 className="headline1-extrabold text-center tracking-[-0.072rem] text-text-default">
        어떤 책으로
        <br />
        대화를 나눠볼까요?
      </h1>
      <div className="relative h-[19.2rem] w-[25.3rem]">
        <Image src={HomeLogo} alt="홈 메인 이미지" fill className="object-contain" />
      </div>
    </main>
  );
};

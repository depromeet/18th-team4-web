import { BookLogo } from '@/assets';

export const MainBody = () => {
  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-[2.4rem] px-[2.4rem]">
      <h1 className="relative headline1-extrabold text-center tracking-[-0.072rem] text-text-default">
        어떤 책으로
        <br />
        대화를 나눠볼까요?
      </h1>
      <div className="relative h-[19.2rem] w-[25.3rem]">
        <BookLogo className="size-full" />
      </div>
    </main>
  );
};

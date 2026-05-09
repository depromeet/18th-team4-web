import { MainSymbolIcon } from '@/components';

export const SummaryLoading = () => {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col items-center w-full gap-[2.4rem]"
    >
      <MainSymbolIcon className="animate-pulse" />
      <div className="flex flex-col gap-[0.2rem]">
        <p className="headline2-extrabold tracking-[-0.03em] text-text-default text-center">
          대화를 요약하고 있어요
        </p>
        <p className="body2-bold tracking-[-0.03em] text-text-caption text-center">
          1분 이내로 걸릴 수 있어요. 잠시만 기다려주세요.
        </p>
      </div>
    </section>
  );
};

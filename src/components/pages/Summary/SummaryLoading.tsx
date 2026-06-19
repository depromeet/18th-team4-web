import Image from 'next/image';
import { SummaryIcon } from '@/assets';

export const SummaryLoading = () => {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="flex w-full flex-col items-center gap-[2.4rem]"
    >
      <Image src={SummaryIcon} alt={'Summary_Icon'} />
      <div className="flex flex-col gap-[0.2rem]">
        <p className="headline2-extrabold animate-summary-title-gradient text-center tracking-[-0.03em]">
          대화를 요약하고 있습니다
        </p>
        <p className="body2-bold tracking-[-0.03em] text-text-caption text-center">
          1분 이내로 걸릴 수 있어요. 잠시만 기다려주세요.
        </p>
      </div>
    </section>
  );
};

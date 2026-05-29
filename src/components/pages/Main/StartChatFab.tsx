'use client';

import { ArrowIcon } from '@/components';

type Props = {
  onClick: () => void;
};

export const StartChatFab = (props: Props) => {
  const { onClick } = props;

  return (
    <div className="absolute bottom-[2.4rem] left-1/2 z-10 -translate-x-1/2 drop-shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
      <div aria-hidden className="absolute inset-0 rounded-full bg-[#e1e1e1]/50 blur-xl" />
      <button
        type="button"
        onClick={onClick}
        className="relative flex cursor-pointer items-center rounded-full bg-white py-[1.2rem] pl-[1.6rem] pr-[1.2rem] shadow-[inset_1.8px_0px_1.8px_0.6px_rgba(0,0,0,0.3),inset_0px_-0.6px_1.2px_0.6px_rgba(0,0,0,0.2),inset_5.5px_5.5px_4px_-4.5px_white,inset_3.6px_5.5px_4.2px_-3.6px_white,inset_-3.6px_-3.6px_1.8px_-3.6px_rgba(255,255,255,0.8)]"
      >
        <span className="body2-bold whitespace-nowrap text-text-default">AI와 대화하기</span>
        <div className="ml-[0.8rem] flex size-[2.4rem] shrink-0 items-center justify-center rounded-full bg-green-darkest shadow-[0px_0px_2.4rem_0px_rgba(0,0,0,0.25)]">
          <ArrowIcon className="rotate-90 size-[1.4rem] fill-white" />
        </div>
      </button>
    </div>
  );
};

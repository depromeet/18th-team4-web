import { CheckIcon } from '@/components/common';

const ChatToast = () => {
  return (
    <div className="absolute top-[2.4rem] left-1/2 -translate-x-1/2 whitespace-nowrap py-[1.6rem] px-[1.4rem] flex gap-[0.35rem] items-center rounded-[100px] border border-text-white bg-text-white shadow-chat-toast z-modal">
      <CheckIcon className="size-[2rem] fill-green-bold" />
      <p className="text-text-default body2-bold pr-[0.8rem]">
        오전 6시에 자동으로 독후감을 요약해요!
      </p>
    </div>
  );
};

export default ChatToast;

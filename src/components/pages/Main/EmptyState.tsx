import Image from 'next/image';
import { emptyIcon } from '@/assets';

type Props = {
  message: string;
};

export const EmptyState = (props: Props) => {
  const { message } = props;

  return (
    <div className="mt-40 flex flex-col items-center">
      <div className="relative h-90 w-[26.7rem] shrink-0 overflow-hidden">
        <Image
          src={emptyIcon}
          alt="No conversations"
          width={301}
          height={301}
          className="absolute left-1/2 top-[-1.694rem] -translate-x-1/2 w-[30.088rem]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-[11.6rem] bg-linear-to-b from-transparent to-white" />
      </div>
      <p className="title1-bold bg-linear-to-r from-text-default to-green-primary bg-clip-text text-center tracking-[-0.054rem] text-transparent">
        {message}
      </p>
    </div>
  );
};

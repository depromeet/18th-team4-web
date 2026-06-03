import { cn } from '@/lib';

type Props = {
  className?: string;
  onClick?: () => void;
};

export const MoreButton = (props: Props) => {
  const { className, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'title1-bold mt-[3.2rem] flex w-full cursor-pointer items-center justify-center gap-[0.8rem] border-t border-transparent px-[2.4rem] py-[1.8rem] text-text-default',
        className,
      )}
    >
      더 보기
    </button>
  );
};

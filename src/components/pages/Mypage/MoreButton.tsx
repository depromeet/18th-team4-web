import Link from 'next/link';
import { cn } from '@/lib';

type Props = {
  /** 지정 시 해당 경로로 이동하는 링크로 렌더된다. */
  href?: string;
  className?: string;
  onClick?: () => void;
};

const MORE_BUTTON_CLASS =
  'title1-bold mt-[3.2rem] flex w-full cursor-pointer items-center justify-center gap-[0.8rem] border-t border-solid [border-image:linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(23,28,27,0.05)_50%,rgba(255,255,255,0)_100%)_1] bg-[#FCFCFC] px-[2.4rem] py-[1.8rem] text-text-default';

export const MoreButton = (props: Props) => {
  const { href, className, onClick } = props;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cn(MORE_BUTTON_CLASS, className)}>
        더 보기
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(MORE_BUTTON_CLASS, className)}>
      더 보기
    </button>
  );
};

import { type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/assets';
import { ArrowIcon, UserIcon } from '@/components';
import { AnimateTooltip } from '@/components/common/Tooltip/AnimateTooltip';
import ChatToast from '@/components/pages/Chat/ChatToast';
import { PATH_NAME } from '@/constants';
import { cn } from '@/lib';
import { HEADER_VARIANT, headerVariants } from './headerVariants';

type HeaderProps = React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    summarizeActive?: boolean;
    onBack?: () => void;
    progress?: number;
  };

const SLIDE_OUT_DURATION_MS = 280;

export const Header = (props: HeaderProps) => {
  const {
    variant = HEADER_VARIANT.HOME,
    className,
    summarizeActive = false,
    onBack,
    progress,
    ...rest
  } = props;

  const handleBack = () => {
    if (!onBack) return;
    const pageEl = document.querySelector('[data-page-transition]') as HTMLElement | null;
    if (pageEl) {
      pageEl.classList.remove('page-fade-in');
      pageEl.classList.add('page-slide-out');
      setTimeout(onBack, SLIDE_OUT_DURATION_MS);
    } else {
      onBack();
    }
  };

  return (
    <header className={cn(headerVariants({ variant }), className)} {...rest}>
      {variant === HEADER_VARIANT.HOME && (
        <>
          <div className="relative h-[2.9rem] w-[12.3rem] shrink-0 overflow-hidden">
            <Image src={Logo} alt="logo" className="absolute" />
          </div>
          <Link
            href={PATH_NAME.mypage.main()}
            aria-label="프로필"
            className="relative flex shrink-0 size-[2.4rem] cursor-pointer items-center justify-center"
          >
            <UserIcon className="size-[2.4rem] text-icon-tertiary" />
          </Link>
        </>
      )}

      {(variant === HEADER_VARIANT.BACK || variant === HEADER_VARIANT.CHAT) && (
        <button
          aria-label="뒤로가기"
          onClick={handleBack}
          className="flex shrink-0 cursor-pointer items-center justify-center"
        >
          <ArrowIcon className="-rotate-90 size-[2.4rem] fill-icon-primary" />
        </button>
      )}

      {variant === HEADER_VARIANT.CHAT && <div>{summarizeActive && <ChatToast />}</div>}

      {variant === HEADER_VARIANT.CHAT && progress !== undefined && (
        <div className="absolute bottom-0 left-0 h-[0.3rem] w-full bg-gray-alpha-10">
          <div
            className="progress-gradient h-full rounded-r-full transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
          <div className="pl-[2.4rem] pt-[1.5rem]">
            <AnimateTooltip arrowAlignment="left" content="요약 생성까지 필요한 대화량이에요" />
          </div>
        </div>
      )}
    </header>
  );
};

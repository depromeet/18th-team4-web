import { type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/assets';
import { AnimateTooltip, ArrowIcon, PlusIcon, UserIcon } from '@/components';
import { PATH_NAME } from '@/constants';
import { cn } from '@/lib';
import { HEADER_VARIANT, headerVariants } from './headerVariants';

type HeaderProps = React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    onBack?: () => void;
    progress?: number;
    rightSlot?: React.ReactNode;
  };

const SLIDE_OUT_DURATION_MS = 280;

export const Header = (props: HeaderProps) => {
  const { variant = HEADER_VARIANT.HOME, className, onBack, progress, rightSlot, ...rest } = props;

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
          <div className="flex shrink-0 items-center gap-[1.6rem]">
            <Link
              href={PATH_NAME.register.list()}
              aria-label="책 추가하기"
              className="relative flex shrink-0 size-[2.4rem] cursor-pointer items-center justify-center"
            >
              <PlusIcon className="size-[2.4rem] text-icon-tertiary" />
            </Link>
            <Link
              href={PATH_NAME.mypage.main()}
              aria-label="프로필"
              className="relative flex shrink-0 size-[2.4rem] cursor-pointer items-center justify-center"
            >
              <UserIcon className="size-[2.4rem] text-icon-tertiary" />
            </Link>
          </div>
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

      {variant === HEADER_VARIANT.BACK && rightSlot}

      {variant === HEADER_VARIANT.CHAT && progress !== undefined && (
        <figure className="absolute bottom-0 left-[2rem] right-[2rem] m-0 h-[0.3rem] rounded-[999px] bg-gray-10">
          <meter
            aria-label="요약 생성 진행도"
            value={Math.min(100, Math.max(0, progress))}
            min={0}
            max={100}
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className="h-full rounded-[999px] bg-gray-700 transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
          <figcaption className="pt-[1.2rem]">
            <AnimateTooltip arrowAlignment="left" content="요약 생성까지 필요한 대화량이에요" />
          </figcaption>
        </figure>
      )}
    </header>
  );
};

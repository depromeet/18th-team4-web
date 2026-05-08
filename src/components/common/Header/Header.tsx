import { type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/assets';
import { ArrowIcon, PlusIcon, Tooltip } from '@/components';
import { PATH_NAME } from '@/constants';
import { cn } from '@/lib';
import { HEADER_VARIANT, headerVariants } from './headerVariants';

type HeaderProps = React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    summarizeActive?: boolean;
    onBack?: () => void;
    onCta?: () => void;
  };

const SLIDE_OUT_DURATION_MS = 280;

export const Header = (props: HeaderProps) => {
  const {
    variant = HEADER_VARIANT.HOME,
    className,
    summarizeActive = false,
    onBack,
    onCta,
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
            href={PATH_NAME.register.list()}
            aria-label="책 등록하기"
            className="relative flex shrink-0 size-[4.6rem] cursor-pointer items-center justify-center rounded-[3.6rem] bg-linear-to-b from-[rgba(255,255,255,0.47)] to-[rgba(255,255,255,0.19)] p-[1.1rem] shadow-[0_0_3.2rem_rgba(0,0,0,0.16)]"
          >
            <PlusIcon className="size-[2.4rem]" />
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

      {variant === HEADER_VARIANT.CHAT && (
        <div className="relative">
          <button
            aria-label="요약하기"
            disabled={!summarizeActive}
            onClick={onCta}
            className={cn('body1-bold tracking-[-0.048rem]', {
              'cursor-pointer text-icon-primary': summarizeActive,
              'cursor-default text-icon-disabled': !summarizeActive,
            })}
          >
            요약하기
          </button>
          {summarizeActive && (
            <div className="absolute right-0 top-[calc(100%+1.3rem)] z-50">
              <Tooltip
                role="tooltip"
                content="이제 대화를 요약할 수 있어요"
                arrowSide="top"
                arrowAlignment="right"
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Summary } from '@/assets';
import { Button } from '@/components';
import { cn } from '@/lib';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const SummarizeModal = (props: Props) => {
  const {
    isOpen,
    onCancel,
    title = '대화 가능 분량을 모두 사용했어요',
    description = (
      <>
        매일 오전 6시, 대화 내용이 자동으로 요약되면 <br /> 새로운 대화를 시작할 수 있어요.
      </>
    ),
  } = props;
  const [isExiting, setIsExiting] = useState(false);
  const exitFinishedRef = useRef(false);

  const finishExit = useCallback(() => {
    if (exitFinishedRef.current) return;
    exitFinishedRef.current = true;
    setIsExiting(false);
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!isExiting) return;
    const id = window.setTimeout(() => {
      finishExit();
    }, 520);
    return () => window.clearTimeout(id);
  }, [isExiting, finishExit]);

  const dismissWithSlide = useCallback(() => {
    if (isExiting) return;
    if (prefersReducedMotion()) {
      onCancel();
      return;
    }
    exitFinishedRef.current = false;
    setIsExiting(true);
  }, [isExiting, onCancel]);

  const handleExitAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      const { animationName } = e;
      if (typeof animationName !== 'string' || !animationName.includes('modal-sheet-exit')) {
        return;
      }
      finishExit();
    },
    [finishExit],
  );

  const shouldRender = isOpen || isExiting;
  if (!shouldRender) return null;

  return createPortal(
    <>
      <div
        role="presentation"
        className={cn(
          'fixed inset-0 z-modal cursor-pointer bg-dim',
          isExiting && 'pointer-events-none',
        )}
        onClick={dismissWithSlide}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-modal-title"
        aria-describedby="summary-modal-description"
        className={cn(
          'fixed inset-0 z-modal m-auto flex h-fit max-h-[90dvh] w-[min(33rem,calc(100vw-4.8rem))] flex-col overflow-hidden rounded-[20px] bg-text-white',
          isExiting ? 'animate-modal-sheet-exit' : 'animate-modal-sheet-enter',
        )}
        onAnimationEnd={handleExitAnimationEnd}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="relative flex min-h-0 w-full flex-1 flex-col items-center gap-[3rem] overflow-y-auto overscroll-contain p-[2.4rem] pt-[2.8rem]">
          <header className="flex flex-col items-center gap-[0.4rem] text-center">
            <Image src={Summary} alt="summary" className="w-[4.3rem] h-[5.3rem]" />
            <h3 id="summary-modal-title" className="text-text-default headline2-bold mt-[1.2rem]">
              {title}
            </h3>
            <p id="summary-modal-description" className="body2-medium text-text-description">
              {description}
            </p>
          </header>

          <footer className="flex w-full">
            <Button size="full" className="rounded-[16px]" onClick={dismissWithSlide}>
              확인
            </Button>
          </footer>
        </div>
      </div>
    </>,
    document.body,
  );
};

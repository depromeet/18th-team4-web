'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, BUTTON_VARIANT, ColorSymbolIcon } from '@/components';
import { cn } from '@/lib';

type Props = {
  isOpen: boolean;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Modal = (props: Props) => {
  const { isOpen, isConfirming = false, onCancel, onConfirm } = props;
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
    if (isExiting || isConfirming) return;
    if (prefersReducedMotion()) {
      onCancel();
      return;
    }
    exitFinishedRef.current = false;
    setIsExiting(true);
  }, [isConfirming, isExiting, onCancel]);

  const handleExitAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDialogElement>) => {
      if (e.target !== e.currentTarget) return;
      const { animationName } = e;
      if (typeof animationName !== 'string' || !animationName.includes('modal-sheet-exit')) {
        return;
      }
      finishExit();
    },
    [finishExit],
  );

  const handleConfirm = () => {
    if (isExiting || isConfirming) return;
    onConfirm();
  };

  const shouldRender = isOpen || isExiting;
  if (!shouldRender) return null;

  return createPortal(
    <>
      <div
        role="presentation"
        className={cn(
          'fixed inset-0 z-modal cursor-pointer bg-dim',
          (isConfirming || isExiting) && 'pointer-events-none',
          isConfirming && 'cursor-wait',
        )}
        onClick={dismissWithSlide}
      />
      <dialog
        open
        aria-modal="true"
        aria-labelledby="summary-modal-title"
        aria-describedby="summary-modal-description"
        className={cn(
          'fixed top-1/2 left-1/2 z-modal m-0 flex max-h-[90dvh] min-w-0 w-[min(33rem,calc(100vw-4.8rem))] flex-col overflow-hidden rounded-[20px] border-none bg-text-white shadow-none',
          'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:[transform:translate(-50%,-50%)]',
          isExiting ? 'animate-modal-sheet-exit' : 'animate-modal-sheet-enter',
        )}
        aria-busy={isConfirming ? true : undefined}
        onAnimationEnd={handleExitAnimationEnd}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="relative flex min-h-0 w-full flex-1 flex-col items-center gap-[3rem] overflow-y-auto overscroll-contain p-[2.4rem] pt-[2.8rem]">
          {isConfirming && (
            <div
              aria-hidden
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[1.2rem] rounded-[20px] bg-text-white/85 px-[2.4rem] backdrop-blur-[2px]"
            >
              <p className="body2-bold text-center text-text-caption">요약을 준비하고 있어요</p>
            </div>
          )}

          <header className="flex flex-col items-center gap-[0.2rem] text-center">
            <ColorSymbolIcon />
            <h3 id="summary-modal-title" className="text-text-default headline2-bold mt-[1.4rem]">
              대화를 마무리할까요?
            </h3>
            <p id="summary-modal-description" className="body2-medium text-text-description">
              요약을 진행하면 여기서 더 대화할 수 없어요.
            </p>
          </header>

          <footer className="flex w-full gap-[1rem]">
            <Button
              variant={BUTTON_VARIANT.LIGHTGRAY}
              size="lg"
              className="rounded-[1.6rem]"
              onClick={dismissWithSlide}
              disabled={isConfirming || isExiting}
            >
              취소
            </Button>

            <Button
              variant={BUTTON_VARIANT.BLACK}
              size="lg"
              className="rounded-[1.6rem]"
              onClick={handleConfirm}
              disabled={isConfirming || isExiting}
            >
              {isConfirming ? '준비 중...' : '확인'}
            </Button>
          </footer>
        </div>
      </dialog>
    </>,
    document.body,
  );
};

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, BUTTON_VARIANT } from '@/components';
import { MODAL_TYPE, ModalType } from '@/constants';
import { cn } from '@/lib';

type Props = {
  isOpen: boolean;
  modalType: ModalType;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Modal = (props: Props) => {
  const { isOpen, modalType = 'DELETE', onCancel, onConfirm, confirmDisabled = false } = props;
  const { title, content } = MODAL_TYPE[modalType];
  const isDestructiveModal =
    modalType === 'DELETE' || modalType === 'LOGOUT' || modalType === 'WITHDRAW';
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

  const handleConfirm = () => {
    if (isExiting) return;
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
          isExiting && 'pointer-events-none',
        )}
        onClick={dismissWithSlide}
      />
      <div className="pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-[2.4rem]">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className={cn(
            'pointer-events-auto flex max-h-[calc(100dvh-4.8rem)] w-full max-w-[33rem] flex-col overflow-hidden rounded-[20px] bg-text-white',
            isExiting ? 'animate-modal-sheet-exit' : 'animate-modal-sheet-enter',
          )}
          onAnimationEnd={handleExitAnimationEnd}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="relative flex min-h-0 w-full flex-col items-center gap-[3rem] overflow-y-auto overscroll-contain p-[2.4rem] pt-[2.8rem]">
            <header className="flex flex-col items-center gap-[0.2rem] text-center">
              <h3 id="modal-title" className="text-text-default headline2-bold mt-[1.4rem]">
                {title}
              </h3>
              <p id="modal-description" className="body2-medium text-text-description">
                {content}
              </p>
            </header>

            <footer className="flex w-full gap-[1rem]">
              {isDestructiveModal ? (
                <Button
                  variant={BUTTON_VARIANT.LIGHTGRAY}
                  size="lg"
                  className="rounded-[1.6rem]"
                  onClick={dismissWithSlide}
                  disabled={isExiting || confirmDisabled}
                >
                  취소
                </Button>
              ) : null}

              <Button
                variant={BUTTON_VARIANT.BLACK}
                size="lg"
                className="rounded-[1.6rem]"
                onClick={handleConfirm}
                disabled={isExiting || confirmDisabled}
              >
                {isDestructiveModal ? '삭제하기' : '확인'}
              </Button>
            </footer>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

'use client';

import { type ReactNode, type TransitionEvent, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  collapsedMaxHeight?: string;
  onMaxHeightTransitionEnd?: (openAfterTransition: boolean) => void;
};

const noOpSubscribe = () => () => {};

/** Header HOME: py 1.6×2 + 행 높이 max(로고 2.9, 버튼 4.6) = 7.8rem — 시트 상단은 헤더 아래 0.5rem */
const BOTTOM_SHEET_MAX_OPEN = 'calc(100dvh - 7.8rem - 0.5rem)';

export const BottomSheet = (props: BottomSheetProps) => {
  const { children, collapsedMaxHeight, onClose, onMaxHeightTransitionEnd, open } = props;
  const mounted = useSyncExternalStore(
    noOpSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleAsideTransitionEnd = (e: TransitionEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (e.propertyName !== 'max-height') {
      return;
    }
    onMaxHeightTransitionEnd?.(open);
  };

  if (!mounted) {
    return null;
  }

  const maxHeight = open ? BOTTOM_SHEET_MAX_OPEN : collapsedMaxHeight;

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed bottom-0 left-1/2 top-0 z-50 w-full max-w-150 -translate-x-1/2 overflow-x-hidden',
      )}
      data-state={open ? 'open' : 'closed'}
    >
      <button
        aria-label="바텀시트 닫기"
        className={cn(
          'absolute inset-0 cursor-pointer border-0 bg-gray-900/25 backdrop-blur-sm transition-opacity duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        type="button"
        onClick={onClose}
      />
      <aside
        aria-label="책 선택"
        aria-modal={open ? 'true' : undefined}
        className="pointer-events-auto absolute inset-x-0 bottom-0 flex min-h-0 min-w-0 max-w-full flex-col overflow-x-hidden overflow-y-hidden bg-white shadow-[0_-8px_32px_rgb(23_39_35/0.1)] outline-none transition-[max-height,border-top-left-radius,border-top-right-radius] duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        role="dialog"
        style={{
          maxHeight: maxHeight ?? undefined,
        }}
        onTransitionEnd={handleAsideTransitionEnd}
      >
        <div className="flex min-h-0 min-w-0 w-full max-w-full flex-col overflow-hidden">
          {children}
        </div>
      </aside>
    </div>,
    document.body,
  );
};

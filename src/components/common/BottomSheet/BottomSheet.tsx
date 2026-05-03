'use client';

import { cn } from '@/lib';
import { type ReactNode, type TransitionEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 접힘 시 패널 상한(헤더 실측 등). 없으면 `12rem` */
  collapsedMaxHeight?: string;
  /** 패널 `max-height` 트랜지션 종료 시점(닫힘·열림 모두). 자식 레이아웃을 트랜지션 후에 맞출 때 사용 */
  onMaxHeightTransitionEnd?: (openAfterTransition: boolean) => void;
};

export const BottomSheet = (props: BottomSheetProps) => {
  const { children, collapsedMaxHeight, onClose, onMaxHeightTransitionEnd, open } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

  const handleAsideTransitionEnd = (e: TransitionEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (e.propertyName !== 'max-height') {
      return;
    }
    onMaxHeightTransitionEnd?.(open);
  };

  const maxPanelHeight =
    'min(80dvh, calc(100dvh - env(safe-area-inset-bottom, 0px)))';

  const collapsedFallback = collapsedMaxHeight ?? '12rem';

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
          'absolute inset-0 border-0 bg-gray-900/25 backdrop-blur-sm transition-opacity duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        type="button"
        onClick={onClose}
      />
      <aside
        aria-modal="true"
        className="pointer-events-auto absolute inset-x-0 bottom-0 flex min-h-0 min-w-0 max-w-full flex-col overflow-x-hidden overflow-y-hidden rounded-t-4xl bg-white shadow-[0_-8px_32px_rgb(23_39_35/0.1)] outline-none transition-[max-height] duration-680 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        role="dialog"
        onTransitionEnd={handleAsideTransitionEnd}
        style={{
          maxHeight: open ? maxPanelHeight : collapsedFallback,
        }}
      >
        <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </aside>
    </div>,
    document.body,
  );
};

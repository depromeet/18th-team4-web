'use client';

import { cn } from '@/lib';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const BottomSheet = (props: BottomSheetProps) => {
  const { children, onClose, open } = props;
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

  const maxPanelHeight =
    'min(80dvh, calc(100dvh - env(safe-area-inset-bottom, 0px)))';

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        'fixed bottom-0 left-1/2 top-0 z-50 w-full max-w-150 -translate-x-1/2',
        !open && 'pointer-events-none',
      )}
      data-state={open ? 'open' : 'closed'}
    >
      <button
        aria-label="바텀시트 닫기"
        className={cn(
          'absolute inset-0 border-0 bg-gray-900/25 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        type="button"
        onClick={onClose}
      />
      <aside
        aria-modal="true"
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-4xl bg-primary-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_32px_rgb(23_39_35/0.1)] outline-none transition-transform duration-300 ease-out motion-reduce:transition-none',
          open ? 'pointer-events-auto translate-y-0' : 'pointer-events-none translate-y-full',
        )}
        role="dialog"
        style={{
          maxHeight: maxPanelHeight,
        }}
      >
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">{children}</div>
      </aside>
    </div>,
    document.body,
  );
};

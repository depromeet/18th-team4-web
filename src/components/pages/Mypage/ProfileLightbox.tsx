'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ProfileImageIcon } from '@/components';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileLightbox = (props: Props) => {
  const { isOpen, onClose } = props;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 열려 있는 동안 배경 스크롤을 잠그고, 포커스를 다이얼로그로 옮긴다.
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="프로필 이미지 확대"
      tabIndex={-1}
      className="animate-[fade-in_0.2s_ease-out_both] fixed inset-0 z-modal flex cursor-zoom-out items-center justify-center bg-black/90 p-[2.4rem] outline-none"
      onClick={onClose}
    >
      <div className="animate-lightbox-zoom flex size-[24rem] max-w-[80vw] items-center justify-center rounded-full bg-green-darkest">
        <ProfileImageIcon className="block h-[16.8rem] w-auto shrink-0" />
      </div>
    </div>,
    document.body,
  );
};

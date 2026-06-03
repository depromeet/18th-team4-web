'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProfileImageIcon } from '@/components';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileLightbox = (props: Props) => {
  const { isOpen, onClose } = props;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="프로필 이미지 확대"
      className="animate-[fade-in_0.2s_ease-out_both] fixed inset-0 z-modal flex cursor-zoom-out items-center justify-center bg-black/90 p-[2.4rem]"
      onClick={onClose}
    >
      <div className="animate-lightbox-zoom flex size-[24rem] max-w-[80vw] items-center justify-center rounded-full bg-green-darkest">
        <ProfileImageIcon className="block h-[16.8rem] w-auto shrink-0" />
      </div>
    </div>,
    document.body,
  );
};

'use client';

import { createPortal } from 'react-dom';
import { Button, BUTTON_VARIANT, ColorSymbolIcon } from '@/components';

type Props = {
  isOpen: boolean;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const Modal = (props: Props) => {
  const { isOpen, isConfirming = false, onCancel, onConfirm } = props;
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-dim [will-change:transform]"
      onClick={onCancel}
    >
      <dialog
        open
        aria-modal="true"
        aria-labelledby="summary-modal-title"
        aria-describedby="summary-modal-description"
        className="relative bg-text-white flex min-w-[330px] flex-col items-center gap-[3rem] rounded-[20px] p-[2.4rem] pt-[2.8rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex flex-col items-center gap-[0.2rem] text-center ">
          <ColorSymbolIcon />
          <h3 className="text-text-default headline2-bold mt-[1.4rem]">대화를 마무리할까요?</h3>
          <p className="body2-medium text-text-description">
            요약을 진행하면 여기서 더 대화할 수 없어요.
          </p>
        </header>

        <footer className="flex w-full gap-[1rem]">
          <Button
            variant={BUTTON_VARIANT.LIGHTGRAY}
            size="lg"
            className="rounded-[1.6rem]"
            onClick={onCancel}
            disabled={isConfirming}
          >
            취소
          </Button>

          <Button
            variant={BUTTON_VARIANT.BLACK}
            size="lg"
            className="rounded-[1.6rem]"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            확인
          </Button>
        </footer>
      </dialog>
    </div>,
    document.body,
  );
};

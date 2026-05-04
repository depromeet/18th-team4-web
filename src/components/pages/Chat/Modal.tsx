'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { Summary } from '@/assets';
import { Button, BUTTON_VARIANT } from '@/components';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const Modal = ({ isOpen, onCancel, onConfirm }: Props) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-dim"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-text-white flex min-w-[330px] flex-col items-center gap-[3rem] rounded-[20px] p-[2.4rem] pt-[2.8rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-[0.2rem] text-center">
          <Image src={Summary} alt="요약 중 로고" width={48} height={18} />
          <h3 className="text-text-default headline2-bold mt-[1.4rem]">대화를 마무리할까요?</h3>
          <p className="body2-medium text-text-description">
            요약을 진행하면 여기서 더 대화할 수 없어요.
          </p>
        </div>

        <div className="flex w-full gap-[1rem]">
          <Button
            variant={BUTTON_VARIANT.LIGHTGRAY}
            size="lg"
            className="rounded-[1.6rem]"
            onClick={onCancel}
          >
            취소
          </Button>

          <Button
            variant={BUTTON_VARIANT.BLACK}
            size="lg"
            className="rounded-[1.6rem]"
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

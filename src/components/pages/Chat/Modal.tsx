import Image from 'next/image';
import { Summary } from '@/assets';
import { Button } from '@/components/common';
import { BUTTON_VARIANT } from '@/components/common/Button/buttonVariants';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const Modal = (props: Props) => {
  const { isOpen, onCancel, onConfirm } = props;

  if (!isOpen) return null;

  return (
    <dialog className="bg-text-white flex flex-col gap-[3rem] rounded-[20px] items-center p-[2.4rem] pt-[2.8rem] min-w-[330px]">
      <div className="flex flex-col gap-[0.2rem] items-center text-center">
        <Image src={Summary} alt="요약 중 로고" width={48} height={18} />
        <h3 className="text-text-default headline2-bold mt-[1.4rem]">대화를 마무리할까요?</h3>
        <p className="body2-medium text-text-description">
          요약을 진행하면 여기서 더 대화할 수 없어요.
        </p>
      </div>
      <div className="flex gap-[1rem] w-full">
        <Button variant={BUTTON_VARIANT.LIGHTGRAY} size="lg" className="rounded-[1.6rem]">
          취소
        </Button>
        <Button variant={BUTTON_VARIANT.BLACK} size="lg" className="rounded-[1.6rem]">
          확인
        </Button>
      </div>
    </dialog>
  );
};

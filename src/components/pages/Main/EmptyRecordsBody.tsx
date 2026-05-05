import Image from 'next/image';
import { Shelve } from '@/assets';

export const EmptyRecordsBody = () => {
  return (
    <div className="flex flex-1 flex-col items-center pt-[8rem] px-[2.4rem]">
      <div className="relative h-[14.48rem] w-[16rem]">
        <Image src={Shelve} alt="책장" fill className="object-contain" />
      </div>
      <div className="mt-[4rem] flex flex-col items-center gap-[0.2rem]">
        <p className="headline2-extrabold text-center tracking-[-0.06rem] text-text-caption">
          첫번째 대화를 시작해볼까요?
        </p>
        <p className="body1-medium text-center tracking-[-0.048rem] text-text-disable">
          아직 저장된 대화가 없어요
        </p>
      </div>
    </div>
  );
};

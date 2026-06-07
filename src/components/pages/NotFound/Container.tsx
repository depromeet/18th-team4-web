import Image from 'next/image';
import { ErrorCharacter } from '@/assets';

export const NotFoundContainer = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Image
        src={ErrorCharacter}
        alt="오류 안내 캐릭터"
        width={214}
        height={200}
        className="h-[20rem] w-[21.4rem] object-contain"
      />

      <div className="mt-[2.4rem] flex flex-col items-center gap-[0.2rem] text-center">
        <p className="title1-bold text-text-caption">오류가 발생했어요</p>
        <p className="body2-medium text-text-disable">잠시 후 다시 시도해주세요</p>
      </div>
    </div>
  );
};

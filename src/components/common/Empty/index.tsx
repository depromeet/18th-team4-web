import Image from 'next/image';
import { Empty as EmptyIcon } from '@/assets';

type Props = {
  title?: string;
  description?: string;
};

export const Empty = (props: Props) => {
  const { title = '검색 결과가 없습니다', description = '책 제목을 다시 확인해주세요' } = props;

  return (
    <section className="flex w-full flex-col items-center justify-center gap-[0.8rem] py-[2.2rem]">
      <Image
        src={EmptyIcon}
        alt=""
        width={1150}
        height={581}
        className="h-auto w-[28.7rem] max-w-full"
      />

      <div className="flex flex-col items-center">
        <p className="title1-bold text-text-caption">{title}</p>
        <p className="body2-medium text-text-disable">{description}</p>
      </div>
    </section>
  );
};

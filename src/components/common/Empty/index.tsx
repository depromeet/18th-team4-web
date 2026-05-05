import { DialogIcon } from '@/assets';

export const Empty = () => {
  return (
    <section className="flex items-center justify-center flex-col pt-16 gap-[1.6rem]">
      <DialogIcon />

      <div className="flex flex-col">
        <p className="text-text-caption title1-bold">검색 결과가 없습니다</p>
        <p className="text-text-disable body1-medium">책 제목을 다시 확인해주세요</p>
      </div>
    </section>
  );
};

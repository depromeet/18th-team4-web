import { ColorSymbolIcon } from '@/components/common/Icon/ColorSymbolIcon';

export default function RegisterComplete() {
  return (
    <main className="flex flex-col h-dvh gap-[2.4rem] justify-center items-center">
      <ColorSymbolIcon className="w-[7.3rem] h-[2.7rem]" />
      <p className="text-text-default headline1-extrabold text-center">
        책을 등록했어요
        <br />
        대화를 시작할게요
      </p>
    </main>
  );
}

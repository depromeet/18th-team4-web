'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { MainSymbolIcon } from '@/components/common/Icon/MainSymbolIcon';
import { PATH_NAME } from '@/constants';

export const RegisterComplete = () => {
  const router = useRouter();

  const handleAnimationEnd = () => {
    router.refresh();
    router.replace(PATH_NAME.main());
  };

  return (
    <main className="flex h-dvh min-h-dvh flex-col">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.push(PATH_NAME.main())} />

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[2.4rem]">
        <MainSymbolIcon className="animate-symbol-pop" onAnimationEnd={handleAnimationEnd} />
        <p className="headline1-extrabold text-center text-text-default">
          책을 등록했어요
          <br />
          대화를 시작할게요
        </p>
      </section>
    </main>
  );
};

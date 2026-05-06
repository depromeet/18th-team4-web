'use client';

import { useRouter } from 'next/navigation';
import { ColorSymbolIcon, Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';

export const RegisterComplete = () => {
  const router = useRouter();

  return (
    <main className="flex h-dvh min-h-dvh flex-col">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.push(PATH_NAME.main())} />

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[2.4rem]">
        <ColorSymbolIcon className="w-[7.3rem] h-[2.7rem]" />
        <p className="text-text-default headline1-extrabold text-center">
          책을 등록했어요
          <br />
          대화를 시작할게요
        </p>
      </section>
    </main>
  );
};

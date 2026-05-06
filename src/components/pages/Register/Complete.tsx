'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ColorSymbolIcon, Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';

const REDIRECT_DELAY_MS = 2000;

export const RegisterComplete = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.refresh(); // 서버 컴포넌트 캐시 무효화 → 홈에서 getUserSession 재호출
      router.replace(PATH_NAME.main());
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [router]);

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

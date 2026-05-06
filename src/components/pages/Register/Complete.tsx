'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ColorSymbolIcon, Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';

const FADE_START_MS = 1500;
const NAVIGATE_MS = 2000;

export const RegisterComplete = () => {
  const router = useRouter();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIsFading(true), FADE_START_MS);
    const navTimer = window.setTimeout(() => {
      router.refresh();
      router.replace(PATH_NAME.main());
    }, NAVIGATE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <main
      className={`flex h-dvh min-h-dvh flex-col transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
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

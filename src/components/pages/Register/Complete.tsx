'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT, MainSymbolIcon } from '@/components';
import { PATH_NAME } from '@/constants';

type Props = {
  sessionId?: string;
};

export const RegisterComplete = (props: Props) => {
  const { sessionId } = props;
  const router = useRouter();

  const handleAnimationEnd = () => {
    router.refresh();
    router.replace(sessionId ? PATH_NAME.chat.detail(sessionId) : PATH_NAME.main());
  };

  return (
    <main className="flex h-dvh min-h-dvh flex-col">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.push(PATH_NAME.main())} />

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[3.6rem] pb-[6rem]">
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

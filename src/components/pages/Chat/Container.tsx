'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT, TextfieldChat } from '@/components/common';
import { CHAT_BG_VARIANT } from '@/constants';

const Container = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-primary-white">
      <div className="bg-gradient-chat pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header variant={HEADER_VARIANT.CHAT} onBack={() => router.back()} />

        <main className="flex-1">{/* 채팅 리스트 */}</main>

        <footer className="px-[2rem] py-[2.4rem] bg-gradient-footer rounded-r-[24px] rounded-l-[24px]">
          <TextfieldChat bgVariant={CHAT_BG_VARIANT.WHITE} placeholder="이야기를 나눠보세요" />
        </footer>
      </div>
    </div>
  );
};

export default Container;

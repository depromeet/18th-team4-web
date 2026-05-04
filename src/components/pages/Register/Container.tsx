'use client';

import { Header, HEADER_VARIANT } from '@/components/common';
import { useRouter } from 'next/navigation';
import RegisterBody from './Body';

export default function RegisterContainer() {
  const router = useRouter();

  const clickBack = () => router.back();

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <Header variant={HEADER_VARIANT.BACK} className="shrink-0" onBack={clickBack} />
      <RegisterBody />
    </div>
  );
}

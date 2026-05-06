'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { SummaryLoading } from './SummaryLoading';

const LoadingContainer = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} />
      <div className="flex w-full px-[2.4rem] flex-1 items-center justify-center">
        <SummaryLoading />
      </div>
    </div>
  );
};

export default LoadingContainer;

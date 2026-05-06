'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';

export const SummaryHeader = () => {
  const router = useRouter();
  return <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} />;
};

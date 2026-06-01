'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';

export const SummaryHeader = () => {
  const router = useRouter();
  const handleBack = () => router.push(PATH_NAME.main());
  return <Header variant={HEADER_VARIANT.BACK} onBack={handleBack} />;
};

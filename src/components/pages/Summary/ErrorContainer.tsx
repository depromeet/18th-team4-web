'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PATH_NAME } from '@/constants';
import { useToastStore } from '@/lib';

export const ErrorContainer = () => {
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);

  useEffect(() => {
    openToast({ type: 'error', message: '요약에 실패했어요. 다시 시도해주세요.' });
    router.replace(PATH_NAME.main());
  }, [openToast, router]);

  return null;
};


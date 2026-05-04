'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';
import { MainFooter } from './Footer';

export const MainContainer = () => {
  const router = useRouter();

  return (
    <>
      <Header
        variant={HEADER_VARIANT.HOME}
        onCta={() => {
          router.push(PATH_NAME.register.list());
        }}
      />
      <MainFooter />
    </>
  );
};

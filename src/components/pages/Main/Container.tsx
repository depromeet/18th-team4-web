'use client';

import { Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';
import { useRouter } from 'next/navigation';
import MainFooter from './Footer';

export default function MainContainer() {
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
}

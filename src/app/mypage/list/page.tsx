import { type Metadata } from 'next';
import { Suspense } from 'react';
import { MypageListContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum:내 서재',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const page = () => {
  // 활성 탭은 클라이언트에서 ?tab= 쿼리로 읽으므로 Suspense로 감싼다.
  return (
    <Suspense>
      <MypageListContainer />
    </Suspense>
  );
};

export default page;

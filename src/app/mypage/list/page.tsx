import { type Metadata } from 'next';
import { Suspense } from 'react';
import { MypageListContainer } from '@/components';
import { getSummariesServer, getUserBooksServer } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum:내 서재',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const page = async () => {
  const [userBooksData, summariesData] = await Promise.all([
    getUserBooksServer().catch(() => null),
    getSummariesServer({ page: 1 }).catch(() => null),
  ]);

  // 활성 탭은 클라이언트에서 ?tab= 쿼리로 읽으므로 Suspense로 감싼다.
  return (
    <Suspense>
      <MypageListContainer
        initialBooks={userBooksData?.books ?? []}
        initialSummaries={summariesData}
      />
    </Suspense>
  );
};

export default page;

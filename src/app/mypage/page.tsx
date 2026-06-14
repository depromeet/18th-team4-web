import { type Metadata } from 'next';
import { Suspense } from 'react';
import { MypageContainer } from '@/components';
import { getSummariesServer, getUserBooksServer, getUserProfile } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum:마이페이지',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const page = async () => {
  const [profileData, userBooksData, summariesData] = await Promise.all([
    getUserProfile().catch(() => null),
    getUserBooksServer().catch(() => null),
    getSummariesServer({ page: 1 }).catch(() => null),
  ]);

  // 활성 탭은 클라이언트에서 ?tab= 쿼리로 읽으므로 Suspense로 감싼다.
  return (
    <Suspense>
      <MypageContainer
        initialProfile={profileData?.profile ?? null}
        initialBooks={userBooksData?.books ?? []}
        initialBooksHasNext={userBooksData?.hasNext ?? false}
        initialSummaries={summariesData}
      />
    </Suspense>
  );
};

export default page;

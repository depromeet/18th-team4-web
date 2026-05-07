import { type Metadata } from 'next';
import { MainContainer } from '@/components';
import { getUserSession } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const page = async () => {
  const sessionData = await getUserSession().catch(() => null);
  const session = sessionData?.session ?? null;

  return <MainContainer session={session} />;
};

export default page;

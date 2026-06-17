import { type Metadata } from 'next';
import { RegisterComplete } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum:책 등록하기',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

type PageProps = {
  searchParams: Promise<{ sessionId?: string | string[] }>;
};

const page = async ({ searchParams }: PageProps) => {
  const { sessionId } = await searchParams;
  const normalizedSessionId = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  return <RegisterComplete sessionId={normalizedSessionId} />;
};

export default page;

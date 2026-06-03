import { type Metadata } from 'next';
import { MypageContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum:마이페이지',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const page = () => {
  return <MypageContainer />;
};

export default page;

import { type Metadata } from 'next';
import { MainContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const page = () => {
  return <MainContainer />;
};

export default page;

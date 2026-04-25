import { type Metadata } from 'next';
import { MainContainer } from '@/components';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Readum',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
}

export default function MainPage() {
  return <MainContainer />;
}

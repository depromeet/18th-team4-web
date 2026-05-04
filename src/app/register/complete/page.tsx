import { Metadata } from 'next';
import { RegisterComplete } from '@/components';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Readum:책 등록하기',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
}

export default function RegisterCompletePage() {
  return <RegisterComplete />;
}

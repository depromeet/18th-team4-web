import { type Metadata } from 'next';
import { ErrorContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

const SummaryErrorPage = () => {
  return <ErrorContainer />;
};

export default SummaryErrorPage;

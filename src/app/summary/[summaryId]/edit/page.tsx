import { type Metadata } from 'next';
import { SummaryEditContainer } from '@/components';
import { getSummary } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약 편집',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

type Props = {
  params: Promise<{ summaryId: string }>;
};

const SummaryEditPage = async (props: Props) => {
  const { summaryId } = await props.params;
  const initialSummary = await getSummary(summaryId).catch(() => null);

  return <SummaryEditContainer summaryId={summaryId} initialSummary={initialSummary} />;
};

export default SummaryEditPage;

import { type Metadata } from 'next';
import { SummaryContainer } from '@/components';
import { getSummary } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

const parseTab = (raw: string | string[] | undefined) => (raw === 'chat' ? 'chat' : 'summary');

type Props = {
  params: Promise<{ summaryId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

const SummaryPage = async (props: Props) => {
  const { summaryId } = await props.params;
  const { tab } = await props.searchParams;
  const initialTab = parseTab(tab);
  const initialSummary = await getSummary(summaryId).catch(() => null);

  return (
    <SummaryContainer
      sessionId={summaryId}
      initialSummary={initialSummary}
      initialTab={initialTab}
    />
  );
};

export default SummaryPage;

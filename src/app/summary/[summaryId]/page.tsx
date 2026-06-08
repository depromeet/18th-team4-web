import { type Metadata } from 'next';
import { SummaryContainer } from '@/components';
import { SUMMARY_TAB } from '@/constants';
import { getMessagesFirstPage, getSummary } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

type Props = {
  params: Promise<{ summaryId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

const SummaryPage = async (props: Props) => {
  const { summaryId } = await props.params;
  const { tab } = await props.searchParams;
  const initialTab = tab === SUMMARY_TAB.CHAT ? SUMMARY_TAB.CHAT : SUMMARY_TAB.SUMMARY;
  const [initialSummary, initialMessages] = await Promise.all([
    getSummary(summaryId).catch(() => null),
    initialTab === SUMMARY_TAB.CHAT ? getMessagesFirstPage(summaryId) : Promise.resolve(null),
  ]);

  return (
    <SummaryContainer
      sessionId={summaryId}
      initialTab={initialTab}
      initialSummary={initialSummary}
      initialMessages={initialMessages}
    />
  );
};

export default SummaryPage;

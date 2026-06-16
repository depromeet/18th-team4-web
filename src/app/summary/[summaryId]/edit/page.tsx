import { type Metadata } from 'next';
import { SummaryEditContainer } from '@/components';
import { getSummaryDetailServer } from '@/lib/api/services/summaries/summaries.server';
import { getSummary as getSessionSummaryServer } from '@/lib/api/services/summary/summary.server';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약 편집',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

type Props = {
  params: Promise<{ summaryId: string }>;
  searchParams: Promise<{ source?: string | string[] }>;
};

const SummaryEditPage = async (props: Props) => {
  const { summaryId } = await props.params;
  const { source: rawSource } = await props.searchParams;
  const source = Array.isArray(rawSource) ? rawSource[0] : rawSource;
  const isSessionSource = source === 'session';
  const [initialSummary, initialSessionSummary] = await Promise.all([
    isSessionSource ? Promise.resolve(null) : getSummaryDetailServer(summaryId).catch(() => null),
    isSessionSource ? getSessionSummaryServer(summaryId).catch(() => null) : Promise.resolve(null),
  ]);

  return (
    <SummaryEditContainer
      summaryId={summaryId}
      sessionId={
        isSessionSource ? summaryId : initialSummary ? String(initialSummary.aiChatSessionId) : ''
      }
      source={isSessionSource ? 'session' : 'detail'}
      initialSummary={initialSummary}
      initialSessionSummary={initialSessionSummary}
    />
  );
};

export default SummaryEditPage;

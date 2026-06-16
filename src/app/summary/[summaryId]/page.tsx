import { type Metadata } from 'next';
import { SummaryContainer } from '@/components';
import { SUMMARY_TAB } from '@/constants';
import { getMessagesFirstPage } from '@/lib';
import { getSummaryDetailServer } from '@/lib/api/services/summaries/summaries.server';
import { getSummary as getSessionSummaryServer } from '@/lib/api/services/summary/summary.server';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

type Props = {
  params: Promise<{ summaryId: string }>;
  searchParams: Promise<{
    draft?: string | string[];
    source?: string | string[];
    tab?: string | string[];
  }>;
};

const SummaryPage = async (props: Props) => {
  const { summaryId } = await props.params;
  const { draft, source, tab } = await props.searchParams;
  const isSessionSource = source === 'session';
  const shouldRequestDraft = isSessionSource && draft === 'true';
  const initialTab = tab === SUMMARY_TAB.CHAT ? SUMMARY_TAB.CHAT : SUMMARY_TAB.SUMMARY;
  const [summaryDetail, sessionSummary] = await Promise.all([
    isSessionSource ? Promise.resolve(null) : getSummaryDetailServer(summaryId).catch(() => null),
    isSessionSource && !shouldRequestDraft
      ? getSessionSummaryServer(summaryId).catch(() => null)
      : Promise.resolve(null),
  ]);
  const sessionId = isSessionSource
    ? summaryId
    : summaryDetail
      ? String(summaryDetail.aiChatSessionId)
      : '';
  const [initialSummary, initialMessages] = await Promise.all([
    Promise.resolve(summaryDetail),
    initialTab === SUMMARY_TAB.CHAT && sessionId
      ? getMessagesFirstPage(sessionId)
      : Promise.resolve(null),
  ]);

  return (
    <SummaryContainer
      summaryId={summaryId}
      sessionId={sessionId}
      source={isSessionSource ? 'session' : 'detail'}
      shouldRequestDraft={shouldRequestDraft}
      initialTab={initialTab}
      initialSummary={initialSummary}
      initialSessionSummary={sessionSummary}
      initialMessages={initialMessages}
    />
  );
};

export default SummaryPage;

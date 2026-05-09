import { type Metadata } from 'next';
import { CHAT_CARD_COLOR, type ChatCardColor, SummaryContainer } from '@/components';
import { getSummary } from '@/lib';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:요약',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

const COLOR_VALUES = Object.values(CHAT_CARD_COLOR) as readonly ChatCardColor[];

const parseColor = (raw: string | undefined): ChatCardColor | undefined => {
  if (!raw) return undefined;
  return COLOR_VALUES.includes(raw as ChatCardColor) ? (raw as ChatCardColor) : undefined;
};

type Props = {
  params: Promise<{ summaryId: string }>;
  searchParams: Promise<{ color?: string }>;
};

const SummaryPage = async (props: Props) => {
  const { summaryId } = await props.params;
  const { color: rawColor } = await props.searchParams;
  const color = parseColor(rawColor);
  const initialSummary = await getSummary(summaryId).catch(() => null);

  return <SummaryContainer sessionId={summaryId} initialSummary={initialSummary} color={color} />;
};

export default SummaryPage;

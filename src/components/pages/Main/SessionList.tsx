import { CHAT_CARD_COLOR_SEQUENCE, ChatCard, DocumentIcon } from '@/components';
import { PATH_NAME } from '@/constants';
import { type SummaryCalendarItem } from '@/lib';

type Props = {
  summaries: SummaryCalendarItem[];
  filteredSummaries: SummaryCalendarItem[];
  onNavigate: (path: string) => void;
};

export const SessionList = (props: Props) => {
  const { summaries, filteredSummaries, onNavigate } = props;

  return (
    <div className="mt-[2.4rem] flex flex-col gap-[1.2rem]">
      <div className="flex items-center gap-[0.4rem] px-[2.4rem]">
        <DocumentIcon className="shrink-0 text-text-caption" />
        <p className="body2-semibold tracking-[-0.042rem]">
          <span className="text-text-description">오전 6시에</span>
          <span className="text-text-caption"> AI가 독후감을 작성해요</span>
        </p>
      </div>
      <ol className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] pb-32">
        {filteredSummaries.map((summary) => {
          const originalIndex = summaries.indexOf(summary);
          const color =
            CHAT_CARD_COLOR_SEQUENCE[
              (summaries.length - 1 - originalIndex) % CHAT_CARD_COLOR_SEQUENCE.length
            ];
          const path = PATH_NAME.summary.detail(String(summary.summaryId));

          return (
            <li key={summary.summaryId}>
              <button
                type="button"
                className="w-full cursor-pointer text-left"
                onClick={() => void onNavigate(path)}
              >
                <ChatCard
                  color={color}
                  bookTitle={summary.bookTitle}
                  summary={summary.title}
                  bookmarked
                />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

import Link from 'next/link';
import { ChatCard, chatCardColorByIndex, Empty, Loading } from '@/components';
import { MYPAGE_TAB, PATH_NAME, PREVIEW_COUNT } from '@/constants';
import { cn, type SummaryListData, useGetSummaries } from '@/lib';
import { MoreButton } from './MoreButton';

type Props = {
  initialSummaries: SummaryListData | null;
};

export const Records = (props: Props) => {
  const { initialSummaries } = props;
  const { data, isPending } = useGetSummaries(initialSummaries);
  const firstPage = data?.pages[0];
  const records = firstPage?.summaries ?? [];
  const previewRecords = records.slice(0, PREVIEW_COUNT);
  const hasMoreRecords = records.length > PREVIEW_COUNT || firstPage?.hasNext;

  if (isPending) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {records.length === 0 ? (
        <Empty
          title="등록된 감상 기록이 없습니다."
          description="채팅으로 감상 기록을 시작해봐요!"
        />
      ) : (
        <ul
          className={cn(
            'flex list-none flex-col gap-[0.4rem] px-[2.4rem] pt-[2.4rem]',
            !hasMoreRecords && 'pb-[2.4rem]',
          )}
        >
          {previewRecords.map((record, index) => (
            <li key={`${record.createdAt}-${record.bookTitle}-${index}`}>
              <Link href={PATH_NAME.summary.detail(String(record.summaryId))} className="block">
                <ChatCard
                  color={chatCardColorByIndex(index)}
                  bookTitle={record.bookTitle}
                  summary={record.content}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasMoreRecords && <MoreButton href={PATH_NAME.mypage.list(MYPAGE_TAB.RECORDS)} />}
    </div>
  );
};

import { ChatCard, chatCardColorByIndex } from '@/components';
import { MYPAGE_TAB, PATH_NAME } from '@/constants';
import { MOCK_RECORDS, PREVIEW_COUNT } from './mockData';
import { MoreButton } from './MoreButton';

export const Records = () => {
  const previewRecords = MOCK_RECORDS.slice(0, PREVIEW_COUNT);
  const hasMore = MOCK_RECORDS.length > PREVIEW_COUNT;

  return (
    <div className="flex flex-col">
      <ul className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] pt-[2.4rem]">
        {previewRecords.map((record, index) => (
          <li key={record.id}>
            <ChatCard
              color={chatCardColorByIndex(index)}
              bookTitle={record.bookTitle}
              summary={record.summary}
            />
          </li>
        ))}
      </ul>

      {hasMore && <MoreButton href={PATH_NAME.mypage.list(MYPAGE_TAB.RECORDS)} />}
    </div>
  );
};

import { ChatCard, chatCardColorByIndex } from '@/components';
import { MYPAGE_TAB, PATH_NAME, PREVIEW_COUNT } from '@/constants';
import { MOCK_RECORDS } from '@/lib';
import { MoreButton } from './MoreButton';

export const Records = () => {
  return (
    <div className="flex flex-col">
      <ul className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] pt-[2.4rem]">
        {MOCK_RECORDS.slice(0, PREVIEW_COUNT).map((record, index) => (
          <li key={record.id}>
            <ChatCard
              color={chatCardColorByIndex(index)}
              bookTitle={record.bookTitle}
              summary={record.summary}
            />
          </li>
        ))}
      </ul>

      {MOCK_RECORDS.length > PREVIEW_COUNT && (
        <MoreButton href={PATH_NAME.mypage.list(MYPAGE_TAB.RECORDS)} />
      )}
    </div>
  );
};

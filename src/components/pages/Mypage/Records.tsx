import {
  CHAT_CARD_COLOR_SEQUENCE,
  chatCardBackgroundColor,
  chatCardTitleColor,
} from '@/components';
import { cn } from '@/lib';
import { MoreButton } from './MoreButton';

type RecordItem = {
  id: number;
  bookTitle: string;
  summary: string;
};

const MOCK_RECORDS: RecordItem[] = [
  {
    id: 1,
    bookTitle: '해리포터와 마법사의 돌',
    summary:
      '대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구',
  },
  {
    id: 2,
    bookTitle: '해리포터와 마법사의 돌',
    summary:
      '대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구',
  },
  {
    id: 3,
    bookTitle: '해리포터와 마법사의 돌',
    summary:
      '대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구',
  },
  {
    id: 4,
    bookTitle: '해리포터와 마법사의 돌',
    summary:
      '대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구',
  },
];

export const Records = () => {
  return (
    <div className="flex flex-col">
      <ul className="flex list-none flex-col gap-[1.6rem] px-[2.4rem] pt-[2.4rem]">
        {MOCK_RECORDS.map((record, index) => {
          const color = CHAT_CARD_COLOR_SEQUENCE[index % CHAT_CARD_COLOR_SEQUENCE.length];

          return (
            <li key={record.id}>
              <article
                className={cn(
                  'relative flex flex-col gap-[0.4rem] overflow-hidden rounded-[2rem] border border-white px-[2.4rem] py-[2rem]',
                  chatCardBackgroundColor[color],
                )}
              >
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_32px_0px_rgba(255,255,255,0.65)]" />

                <p className="body2-medium relative tracking-[-0.056rem] text-text-disable">
                  {record.bookTitle}
                </p>
                <p
                  className={cn(
                    'headline2-bold relative line-clamp-2 tracking-[-0.06rem]',
                    chatCardTitleColor[color],
                  )}
                >
                  {record.summary}
                </p>
              </article>
            </li>
          );
        })}
      </ul>

      <MoreButton />
    </div>
  );
};

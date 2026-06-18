'use client';

import { useEffect, useState } from 'react';
import { BookmarkCheckIcon, CHAT_CARD_COLOR_SEQUENCE, ChatCard } from '@/components';
import { PATH_NAME } from '@/constants';
import { type SummaryCalendarItem } from '@/lib';

type Props = {
  records: SummaryCalendarItem[];
  onNavigate: (path: string) => void;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const TARGET_HOUR = 6;
const PIE_RADIUS = 5;
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS;

const getNextSixState = () => {
  const now = new Date();
  const nextSix = new Date(now);
  nextSix.setHours(TARGET_HOUR, 0, 0, 0);

  if (nextSix.getTime() <= now.getTime()) {
    nextSix.setDate(nextSix.getDate() + 1);
  }

  const remainingMs = nextSix.getTime() - now.getTime();
  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
  const remainingHours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  return {
    remainingRatio: Math.min(1, Math.max(0, remainingMs / DAY_MS)),
    label:
      remainingHours > 0
        ? `오전 6시까지 ${remainingHours}시간 ${minutes}분 남음`
        : `오전 6시까지 ${minutes}분 남음`,
  };
};

const SixAMCountdownPie = () => {
  const [state, setState] = useState<ReturnType<typeof getNextSixState> | null>(null);

  useEffect(() => {
    const update = () => setState(getNextSixState());
    update();

    const id = window.setInterval(update, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!state) {
    return <span className="size-[1.4rem] shrink-0 rounded-full bg-gray-alpha-50" />;
  }

  const dashOffset = PIE_CIRCUMFERENCE * (1 - state.remainingRatio);

  return (
    <svg role="img" aria-label={state.label} className="size-[1.4rem] shrink-0" viewBox="0 0 14 14">
      <title>{state.label}</title>
      <circle
        cx="7"
        cy="7"
        r={PIE_RADIUS}
        fill="none"
        stroke="var(--color-gray-10)"
        strokeWidth="4"
      />
      <circle
        cx="7"
        cy="7"
        r={PIE_RADIUS}
        fill="none"
        stroke="var(--color-green-darkest)"
        strokeDasharray={PIE_CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        strokeWidth="4"
        transform="rotate(-90 7 7)"
      />
    </svg>
  );
};

export const SessionList = (props: Props) => {
  const { records, onNavigate } = props;

  return (
    <div className="mt-[2.4rem] flex flex-col gap-[1.2rem]">
      <div className="flex items-center gap-[0.4rem] px-[2.4rem]">
        <SixAMCountdownPie />
        <p className="body2-semibold flex min-w-0 items-center gap-[0.4rem] tracking-[-0.042rem]">
          <span className="text-text-description">오전 6시에</span>
          <span className="text-text-caption"> AI가 독후감을 작성해요</span>
        </p>
      </div>
      <ol className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] pb-32">
        {records.map((record, index) => {
          const color =
            CHAT_CARD_COLOR_SEQUENCE[
              (records.length - 1 - index) % CHAT_CARD_COLOR_SEQUENCE.length
            ];
          const isSummarized = record.summaryId !== null;
          const path = isSummarized
            ? PATH_NAME.summary.detail(String(record.summaryId))
            : PATH_NAME.chat.detail(String(record.chatSessionId));

          return (
            <li key={record.chatSessionId}>
              <button
                type="button"
                className="w-full cursor-pointer text-left"
                onClick={() => void onNavigate(path)}
              >
                <div className="relative">
                  <ChatCard
                    color={color}
                    bookTitle={record.bookTitle}
                    summary={record.chatSummary}
                    className={isSummarized ? 'pr-[6rem]' : undefined}
                  />
                  {isSummarized ? (
                    <BookmarkCheckIcon
                      color={color}
                      className="absolute top-[1.2rem] right-[1.6rem] h-[3.2rem] w-[2.8rem]"
                    />
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

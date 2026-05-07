'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import { Shelve } from '@/assets';
import {
  CHAT_CARD_COLOR_SEQUENCE,
  CHAT_CARD_STATUS,
  ChatCard,
  Header,
  HEADER_VARIANT,
} from '@/components';
import { type SessionStatus, useGetSessions } from '@/lib';

<<<<<<< HEAD
<<<<<<< HEAD
const SESSION_STATUS_TO_CARD: Record<
  SessionStatus,
  (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS]
> = {
=======
// TODO: MainFooter의 selectedId(userBookId) 대체 필요
const TEMP_USER_BOOK_ID = 1;

=======
>>>>>>> 20cbbc0 (feat: 실제 bookid로 변경)
const SESSION_STATUS_TO_CARD: Record<SessionStatus, (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS]> = {
>>>>>>> 2d2fae9 (fix: formatDate가 datetime에서 깨지는 문제 해결)
  ACTIVE: CHAT_CARD_STATUS.DEFAULT,
  SUMMARIZING: CHAT_CARD_STATUS.LOADING,
  CLOSED: CHAT_CARD_STATUS.DEFAULT,
  FAILED: CHAT_CARD_STATUS.ERROR,
};

const formatDate = (isoDate: string) => {
  const datePart = isoDate.split('T')[0] ?? '';
  if (datePart.length < 10) return '';
  return datePart.slice(2).replace(/-/g, '.');
};

type Props = {
  userBookId: number;
};

export const RecordsBody = (props: Props) => {
  const { userBookId } = props;
  const containerRef = useRef<HTMLOListElement>(null);
  const { data } = useGetSessions(userBookId);
<<<<<<< HEAD
  const sessions = useMemo(() => data?.sessions ?? [], [data?.sessions]);
=======
  const sessions = data?.sessions ?? [];
>>>>>>> 20cbbc0 (feat: 실제 bookid로 변경)

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sessions]);

  const isEmpty = sessions.length === 0;

  return (
    <main className="relative flex flex-1 flex-col overflow-y-hidden bg-background-primary-base">
      <Header variant={HEADER_VARIANT.HOME} className="absolute top-0 z-10" />
      {isEmpty ? (
        <div className="mt-32 flex flex-1 flex-col items-center justify-center px-[2.4rem] pb-[6.4rem]">
          <div className="relative h-[14.48rem] w-[16rem] shrink-0">
            <Image src={Shelve} alt="책장" fill className="object-contain" />
          </div>
          <div className="mt-16 flex flex-col items-center gap-[0.2rem]">
            <h2 className="headline2-extrabold text-center tracking-[-0.06rem] text-text-caption">
              첫번째 대화를 시작해볼까요?
            </h2>
            <p className="body1-medium text-center tracking-[-0.048rem] text-text-disable">
              아직 저장된 대화가 없어요
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1" />
          <ol
            ref={containerRef}
            className="relative flex list-none flex-col overflow-y-auto py-[6.4rem]"
          >
            {sessions.map((session, index) => (
              <li key={session.sessionId} className="mb-[-6.4rem]">
                <ChatCard
                  color={
                    CHAT_CARD_COLOR_SEQUENCE[
                      (sessions.length - 1 - index) % CHAT_CARD_COLOR_SEQUENCE.length
                    ]
                  }
                  status={SESSION_STATUS_TO_CARD[session.status]}
                  date={formatDate(session.lastChattedDate)}
                  summary={session.title}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
};

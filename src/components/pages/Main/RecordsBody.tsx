'use client';

import { useEffect, useRef } from 'react';
import { CHAT_CARD_COLOR_SEQUENCE, CHAT_CARD_STATUS, ChatCard, Header, HEADER_VARIANT } from '@/components';
import { type SessionStatus, useGetSessions } from '@/lib';

const SESSION_STATUS_TO_CARD: Record<
  SessionStatus,
  (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS]
> = {
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
  const sessions = data?.sessions ?? [];

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sessions]);

  return (
    <main className="relative flex flex-1 flex-col overflow-y-hidden bg-background-primary-base">
      <Header variant={HEADER_VARIANT.HOME} className="absolute top-0 z-10" />
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
    </main>
  );
};

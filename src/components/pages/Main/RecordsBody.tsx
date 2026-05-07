'use client';

import { useEffect, useRef } from 'react';
import { CHAT_CARD_COLOR_SEQUENCE, CHAT_CARD_STATUS, ChatCard, Header, HEADER_VARIANT } from '@/components';
import { useGetSessions, type SessionStatus } from '@/lib';

const TEMP_USER_BOOK_ID = 1;

const SESSION_STATUS_TO_CARD: Record<SessionStatus, (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS]> = {
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

export const RecordsBody = () => {
  const containerRef = useRef<HTMLOListElement>(null);
  const { data } = useGetSessions(TEMP_USER_BOOK_ID);
  const sessions = data?.sessions ?? [];

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sessions]);

  return (
    <main className="relative flex-1 flex flex-col bg-background-primary-base overflow-y-hidden">
      <Header variant={HEADER_VARIANT.HOME} className="absolute top-0 z-10" />
      <div className="flex-1" />
      <ol ref={containerRef} className="list-none relative flex flex-col overflow-y-auto py-[6.4rem]">
        {sessions.map((session, index) => (
          <li key={session.sessionId} className="mb-[-6.4rem]">
            <ChatCard
              color={CHAT_CARD_COLOR_SEQUENCE[(sessions.length - 1 - index) % CHAT_CARD_COLOR_SEQUENCE.length]}
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

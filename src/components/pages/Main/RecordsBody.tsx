'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Shelve } from '@/assets';
import {
  CHAT_CARD_COLOR_SEQUENCE,
  CHAT_CARD_STATUS,
  ChatCard,
  Header,
  HEADER_VARIANT,
} from '@/components';
import { PATH_NAME } from '@/constants';
import {
  type SessionStatus,
  setLastSelectedUserBookIdClient,
  useGetSessions,
  usePatchLastSelectedUserBook,
} from '@/lib';

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
  const router = useRouter();
  const { mutateAsync: patchLastSelected } = usePatchLastSelectedUserBook();
  const containerRef = useRef<HTMLOListElement>(null);
  const { data, isPending } = useGetSessions(userBookId);
  const sessions = data?.sessions ?? [];

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sessions]);

  const isEmpty = !isPending && sessions.length === 0;

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
            {sessions.map((session, index) => {
              const sessionIdStr = String(session.sessionId);
              const color =
                CHAT_CARD_COLOR_SEQUENCE[
                  (sessions.length - 1 - index) % CHAT_CARD_COLOR_SEQUENCE.length
                ];
              const path =
                session.status === 'CLOSED' || session.status === 'SUMMARIZING'
                  ? `${PATH_NAME.summary.detail(sessionIdStr)}?color=${color}`
                  : PATH_NAME.chat.detail(sessionIdStr);

              return (
                <li key={session.sessionId} className="mb-[-6.4rem]">
                  <Link
                    href={path}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await patchLastSelected(userBookId);
                      } catch {
                        // 서버 반영 실패해도 이동·클라이언트 선택값은 유지
                      }
                      setLastSelectedUserBookIdClient(userBookId);
                      router.push(path);
                    }}
                  >
                    <ChatCard
                      color={color}
                      status={SESSION_STATUS_TO_CARD[session.status]}
                      date={formatDate(session.lastChattedDate)}
                      summary={session.title}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </main>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { emptyIcon } from '@/assets';
import {
  ArrowIcon,
  CHAT_CARD_COLOR_SEQUENCE,
  CHAT_CARD_STATUS,
  ChatCard,
  DocumentIcon,
  Header,
  HEADER_VARIANT,
} from '@/components';
import { PATH_NAME } from '@/constants';
import {
  type SessionStatus,
  setLastSelectedUserBookIdClient,
  useCreateSession,
  useGetSessions,
  usePatchLastSelectedUserBook,
} from '@/lib';
import { CalendarView } from './CalendarView';

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
  const { mutateAsync: createSessionAsync } = useCreateSession();
  const bottomSentinelRef = useRef<HTMLLIElement>(null);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSessions(userBookId);

  const sessions = (data?.pages ?? []).flatMap((page) => page.sessions);

  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const streakDates = sessions
    .map((s) => s.lastChattedDate.split('T')[0])
    .filter((d): d is string => d !== undefined && d.length === 10);

  const filteredSessions = sessions.filter((s) => s.lastChattedDate.startsWith(selectedDate));

  const isEmpty = !isPending && sessions.length === 0;
  const isDateEmpty = !isPending && sessions.length > 0 && filteredSessions.length === 0;

  const handleStartChat = async () => {
    try {
      const sessionData = await createSessionAsync(userBookId);
      try {
        await patchLastSelected(userBookId);
      } catch {
        console.warn('[RecordsBody] lastSelectedUserBookId 동기화 실패');
      }
      setLastSelectedUserBookIdClient(userBookId);
      router.push(PATH_NAME.chat.detail(String(sessionData.sessionId)));
    } catch {}
  };

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-white">
      <Header variant={HEADER_VARIANT.HOME} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <CalendarView
          streakDates={streakDates}
          selectedDate={selectedDate}
          onDaySelect={setSelectedDate}
        />
        {isEmpty ? (
          <div className="flex flex-col items-center mt-[10rem]">
            <div className="relative h-[22.5rem] w-[26.7rem] shrink-0 overflow-hidden">
              <Image
                src={emptyIcon}
                alt="대화 없음"
                width={301}
                height={301}
                className="absolute left-1/2 top-[-1.694rem] -translate-x-1/2 w-[30.088rem]"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[11.6rem] bg-linear-to-b from-transparent to-white" />
            </div>
            <p className="title1-bold bg-linear-to-r from-text-default to-green-primary bg-clip-text text-center tracking-[-0.054rem] text-transparent">
              첫 대화를 시작해볼까요?
            </p>
          </div>
        ) : isDateEmpty ? (
          <div className="flex flex-col items-center mt-[10rem]">
            <div className="relative h-[22.5rem] w-[26.7rem] shrink-0 overflow-hidden">
              <Image
                src={emptyIcon}
                alt="대화 없음"
                width={301}
                height={301}
                className="absolute left-1/2 top-[-1.694rem] -translate-x-1/2 w-[30.088rem]"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[11.6rem] bg-linear-to-b from-transparent to-white" />
            </div>
            <p className="title1-bold bg-linear-to-r from-text-default to-green-primary bg-clip-text text-center tracking-[-0.054rem] text-transparent">
              이 날은 대화 기록이 없어요
            </p>
          </div>
        ) : (
          <div className="mt-[2.4rem] flex flex-col gap-[1.2rem]">
            <div className="flex items-center gap-[0.4rem] px-[2.4rem]">
              <DocumentIcon className="shrink-0 text-text-caption" />
              <p className="body2-semibold tracking-[-0.042rem]">
                <span className="text-text-description">오전 6시에</span>
                <span className="text-text-caption"> AI가 독후감을 작성해요</span>
              </p>
            </div>
            <ol className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] pb-[8rem]">
              {filteredSessions.map((session) => {
                const sessionIdStr = String(session.sessionId);
                const originalIndex = sessions.indexOf(session);
                const color =
                  CHAT_CARD_COLOR_SEQUENCE[
                    (sessions.length - 1 - originalIndex) % CHAT_CARD_COLOR_SEQUENCE.length
                  ];
                const path =
                  session.status === 'CLOSED' || session.status === 'SUMMARIZING'
                    ? `${PATH_NAME.summary.detail(sessionIdStr)}?color=${color}`
                    : PATH_NAME.chat.detail(sessionIdStr);

                return (
                  <li key={session.sessionId}>
                    <Link
                      href={path}
                      className="cursor-pointer"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await patchLastSelected(userBookId);
                        } catch {}
                        setLastSelectedUserBookIdClient(userBookId);
                        router.push(path);
                      }}
                    >
                      <ChatCard
                        color={color}
                        status={SESSION_STATUS_TO_CARD[session.status]}
                        date={formatDate(session.lastChattedDate)}
                        summary={session.title}
                        bookmarked={session.status === 'CLOSED'}
                      />
                    </Link>
                  </li>
                );
              })}
              <li ref={bottomSentinelRef} aria-hidden />
            </ol>
          </div>
        )}
      </div>
      <div className="absolute bottom-[2.4rem] left-1/2 z-10 -translate-x-1/2 drop-shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
        <div aria-hidden className="absolute inset-0 rounded-full bg-[#e1e1e1]/50 blur-[1.5rem]" />
        <button
          type="button"
          onClick={() => void handleStartChat()}
          className="relative flex cursor-pointer items-center rounded-full bg-white py-[1.2rem] pl-[1.6rem] pr-[1.2rem] shadow-[inset_1.8px_0px_1.8px_0.6px_rgba(0,0,0,0.3),inset_0px_-0.6px_1.2px_0.6px_rgba(0,0,0,0.2),inset_5.5px_5.5px_4px_-4.5px_white,inset_3.6px_5.5px_4.2px_-3.6px_white,inset_-3.6px_-3.6px_1.8px_-3.6px_rgba(255,255,255,0.8)]"
        >
          <span className="body2-bold whitespace-nowrap text-text-default">AI와 대화하기</span>
          <div className="ml-[0.8rem] flex size-[2.4rem] shrink-0 items-center justify-center rounded-full bg-green-darkest shadow-[0px_0px_2.4rem_0px_rgba(0,0,0,0.25)]">
            <ArrowIcon className="rotate-90 size-[1.4rem] fill-white" />
          </div>
        </button>
      </div>
    </main>
  );
};

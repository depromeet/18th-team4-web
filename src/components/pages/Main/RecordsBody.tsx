'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Header, HEADER_VARIANT, Loading } from '@/components';
import { PATH_NAME } from '@/constants';
import {
  setLastSelectedUserBookIdClient,
  useCalendarStore,
  useCreateSession,
  useGetSessions,
  usePatchLastSelectedUserBook,
  useToastStore,
} from '@/lib';
import { CalendarView } from './CalendarView';
import { EmptyState } from './EmptyState';
import { SessionList } from './SessionList';
import { StartChatFab } from './StartChatFab';

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

  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);

  const streakDates = sessions
    .map((s) => s.lastChattedDate.split('T')[0])
    .filter((d): d is string => d !== undefined && d.length === 10);

  const filteredSessions = sessions.filter((s) => s.lastChattedDate.startsWith(selectedDate));

  const isEmpty = !isPending && sessions.length === 0;
  const isDateEmpty = !isPending && sessions.length > 0 && filteredSessions.length === 0;

  const openToast = useToastStore((s) => s.openToast);

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
    } catch {
      openToast({ type: 'error', message: '대화를 시작할 수 없어요. 잠시 후 다시 시도해주세요.' });
    }
  };

  const handleNavigate = async (path: string) => {
    try {
      await patchLastSelected(userBookId);
    } catch {}
    setLastSelectedUserBookIdClient(userBookId);
    router.push(path);
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
        {isPending ? (
          <div className="flex flex-1">
            <Loading />
          </div>
        ) : isEmpty ? (
          <EmptyState message="첫 대화를 시작해볼까요?" />
        ) : isDateEmpty ? (
          <EmptyState message="이 날은 대화 기록이 없어요" />
        ) : (
          <SessionList
            sessions={sessions}
            filteredSessions={filteredSessions}
            sentinelRef={bottomSentinelRef}
            onNavigate={handleNavigate}
          />
        )}
      </div>
      <StartChatFab onClick={() => void handleStartChat()} />
    </main>
  );
};

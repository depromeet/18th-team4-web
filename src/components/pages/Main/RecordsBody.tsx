'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header, HEADER_VARIANT, Loading } from '@/components';
import { PATH_NAME } from '@/constants';
import {
  setLastSelectedUserBookIdClient,
  toLocalDateString,
  useCalendarStore,
  useCreateSession,
  useGetSessions,
  usePatchLastSelectedUserBook,
  type UserBookItem,
  useToastStore,
} from '@/lib';
import { CalendarView } from './CalendarView';
import { EmptyState } from './EmptyState';
import { SessionList } from './SessionList';
import { StartChatBookSheet } from './StartChatBookSheet';
import { StartChatFab } from './StartChatFab';

type Props = {
  userBookId: number;
  books: UserBookItem[];
};

export const RecordsBody = (props: Props) => {
  const { userBookId, books } = props;
  const router = useRouter();
  const { mutateAsync: patchLastSelected } = usePatchLastSelectedUserBook();
  const { mutateAsync: createSessionAsync } = useCreateSession();

  const { data, isPending } = useGetSessions(userBookId);

  const sessions = data?.sessions ?? [];
  const bookTitle = data?.book.title;

  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);

  const streakDates = sessions
    .map((s) => s.lastChattedDate.split('T')[0])
    .filter((d): d is string => d !== undefined && d.length === 10);

  const filteredSessions = sessions.filter((s) => s.lastChattedDate.startsWith(selectedDate));

  const isToday = selectedDate === toLocalDateString(new Date());
  const isEmpty = !isPending && filteredSessions.length === 0;

  const openToast = useToastStore((s) => s.openToast);

  const [isBookSheetOpen, setIsBookSheetOpen] = useState(false);

  const handleStartChat = async (bookId: number) => {
    try {
      const sessionData = await createSessionAsync(bookId);
      try {
        await patchLastSelected(bookId);
      } catch {
        console.warn('[RecordsBody] lastSelectedUserBookId 동기화 실패');
      }
      setLastSelectedUserBookIdClient(bookId);
      router.push(PATH_NAME.chat.detail(String(sessionData.sessionId)));
    } catch {
      openToast({ type: 'error', message: '대화를 시작할 수 없어요. 잠시 후 다시 시도해주세요.' });
    }
  };

  // 등록된 책이 없으면 책 추가하기로, 1권 이상이면 책 선택 바텀시트를 띄운다.
  const handleStartChatClick = () => {
    if (books.length === 0) {
      router.push(PATH_NAME.register.list());
      return;
    }
    setIsBookSheetOpen(true);
  };

  const handleConfirmBook = (bookId: number) => {
    setIsBookSheetOpen(false);
    void handleStartChat(bookId);
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
          <EmptyState
            message={isToday ? '오늘의 첫 대화를 시작해볼까요?' : '이 날은 대화 기록이 없어요'}
          />
        ) : (
          <SessionList
            sessions={sessions}
            filteredSessions={filteredSessions}
            bookTitle={bookTitle}
            onNavigate={handleNavigate}
          />
        )}
      </div>
      <StartChatFab onClick={handleStartChatClick} />
      <StartChatBookSheet
        open={isBookSheetOpen}
        books={books}
        selectedUserBookId={userBookId}
        onClose={() => setIsBookSheetOpen(false)}
        onConfirm={handleConfirmBook}
      />
    </main>
  );
};

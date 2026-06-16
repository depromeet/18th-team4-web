'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';
import { getLastSelectedUserBookIdClient, type UserBookItem } from '@/lib';
import { toLocalDateString, useCalendarStore } from '@/lib';
import { CalendarView } from './CalendarView';
import { EmptyState } from './EmptyState';
import { RecordsBody } from './RecordsBody';
import { StartChatFab } from './StartChatFab';

type Props = {
  books: UserBookItem[];
  initialSelectedUserBookId?: number;
};

export const MainBooksShell = (props: Props) => {
  const { books, initialSelectedUserBookId } = props;
  const router = useRouter();

  const fromClient = getLastSelectedUserBookIdClient(books);
  const selectedUserBookId = fromClient !== undefined ? fromClient : initialSelectedUserBookId;
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);

  if (selectedUserBookId === undefined) {
    const isToday = selectedDate === toLocalDateString(new Date());

    return (
      <main className="relative flex h-dvh flex-col overflow-hidden bg-white">
        <Header variant={HEADER_VARIANT.HOME} />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <CalendarView
            streakDates={[]}
            selectedDate={selectedDate}
            ready
            onDaySelect={setSelectedDate}
          />
          <EmptyState
            message={isToday ? '오늘의 첫 대화를 시작해볼까요?' : '이 날은 대화 기록이 없어요'}
          />
        </div>
        <StartChatFab onClick={() => router.push(PATH_NAME.register.list())} />
      </main>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <RecordsBody key={selectedUserBookId} userBookId={selectedUserBookId} books={books} />
    </div>
  );
};

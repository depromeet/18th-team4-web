'use client';

import { ChevronIcon } from '@/components';
import { cn, toLocalDateString, useCalendarStore } from '@/lib';
import { MonthCalendar } from './MonthCalendar';
import { WeekStreak } from './WeekStreak';

type View = 'week' | 'month';
type WeekDay = Parameters<typeof WeekStreak>[0]['days'][number];

type Props = {
  streakDates?: string[];
  selectedDate?: string;
  onDaySelect?: (dateStr: string) => void;
};

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const getMondayOfWeek = (d: Date) => {
  const diff = (d.getDay() + 6) % 7;
  return addDays(d, -diff);
};

export const CalendarView = (props: Props) => {
  const { streakDates = [], selectedDate, onDaySelect } = props;
  const view = useCalendarStore((s) => s.view);
  const setView = useCalendarStore((s) => s.setView);
  const baseDateMs = useCalendarStore((s) => s.baseDateMs);
  const setBaseDateMs = useCalendarStore((s) => s.setBaseDateMs);
  const baseDate = new Date(baseDateMs);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateString(today);
  const streakSet = new Set(streakDates);

  const handlePrevClick = () => {
    if (view === 'week') {
      setBaseDateMs(addDays(baseDate, -7).getTime());
    } else {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() - 1);
      setBaseDateMs(d.getTime());
    }
  };

  const handleNextClick = () => {
    if (view === 'week') {
      setBaseDateMs(addDays(baseDate, 7).getTime());
    } else {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + 1);
      setBaseDateMs(d.getTime());
    }
  };

  const monday = getMondayOfWeek(baseDate);
  const weekDays: WeekDay[] = WEEK_LABELS.map((label, i) => {
    const d = addDays(monday, i);
    d.setHours(0, 0, 0, 0);
    const dateStr = toLocalDateString(d);
    const isToday = dateStr === todayStr;
    const isFuture = d > today;
    const isActive = streakSet.has(dateStr);
    const state = isFuture ? 'future' : isActive ? 'active' : 'default';
    return { label, date: d.getDate(), dateStr, state, isToday };
  });

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;

  const streakDaysForMonth = streakDates
    .filter((s) => {
      const [y, m] = s.split('-').map(Number);
      return y === year && m === month;
    })
    .map((s) => Number(s.split('-')[2]));

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-[2rem] pb-[0.8rem]">
        <div className="relative flex items-center rounded-full bg-gray-alpha-50 px-[0.5rem] py-[0.4rem] shadow-[inset_0px_0px_4px_0px_rgba(23,28,27,0.03)]">
          <div
            aria-hidden
            className="absolute bottom-[0.4rem] top-[0.4rem] rounded-full bg-text-default drop-shadow-[0px_0px_1.5px_rgba(0,0,0,0.25)]"
            style={{
              width: 'calc(50% - 0.5rem)',
              left: view === 'week' ? '0.5rem' : '50%',
              transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <button
            type="button"
            onClick={() => setView('week')}
            className={cn(
              'relative z-10 flex-1 cursor-pointer rounded-full px-[1rem] py-[0.6rem] text-center text-caption1 font-semibold leading-none tracking-[-0.024em] transition-colors duration-200',
              view === 'week' ? 'text-white' : 'text-text-caption',
            )}
          >
            주
          </button>
          <button
            type="button"
            onClick={() => setView('month')}
            className={cn(
              'relative z-10 flex-1 cursor-pointer rounded-full px-[1rem] py-[0.6rem] text-center text-caption1 font-semibold leading-none tracking-[-0.024em] transition-colors duration-200',
              view === 'month' ? 'text-white' : 'text-text-caption',
            )}
          >
            월
          </button>
        </div>

        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            onClick={() => {
              setBaseDateMs(new Date().getTime());
              onDaySelect?.(todayStr);
            }}
            className="cursor-pointer rounded-full border border-solid border-gray-alpha-50 bg-white px-[0.8rem] py-[0.4rem] text-caption1 font-semibold leading-none tracking-[-0.024em] text-text-description"
          >
            오늘
          </button>
          <button
            type="button"
            aria-label="이전"
            onClick={handlePrevClick}
            className="flex cursor-pointer items-center justify-center"
          >
            <ChevronIcon className="rotate-90 size-[2rem] fill-text-caption" />
          </button>
          <button
            type="button"
            aria-label="다음"
            onClick={handleNextClick}
            className="flex cursor-pointer items-center justify-center"
          >
            <ChevronIcon className="-rotate-90 size-[2rem] fill-text-caption" />
          </button>
        </div>
      </div>

      <div key={`${view}-${year}-${month}`} className="animate-calendar-in">
        {view === 'week' ? (
          <WeekStreak days={weekDays} selectedDate={selectedDate} onDayClick={onDaySelect} />
        ) : (
          <MonthCalendar
            year={year}
            month={month}
            streakDates={streakDaysForMonth}
            todayDate={today}
            selectedDate={selectedDate}
            onDayClick={onDaySelect}
          />
        )}
      </div>
    </div>
  );
};

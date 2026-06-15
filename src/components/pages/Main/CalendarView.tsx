'use client';

import { useEffect } from 'react';
import { ChevronIcon } from '@/components';
import { cn, toLocalDateString, useCalendarStore } from '@/lib';
import { MonthCalendar } from './MonthCalendar';

type Props = {
  streakDates?: string[];
  selectedDate?: string;
  onDaySelect?: (dateStr: string) => void;
};

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const startOfWeek = (d: Date) => {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
};

export const CalendarView = (props: Props) => {
  const { streakDates = [], selectedDate, onDaySelect } = props;
  const view = useCalendarStore((s) => s.view);
  const setView = useCalendarStore((s) => s.setView);

  // localStorage에 저장된 주/월 선택을 마운트 후 적용(persist skipHydration 대응).
  useEffect(() => {
    void useCalendarStore.persist.rehydrate();
  }, []);
  const baseDateMs = useCalendarStore((s) => s.baseDateMs);
  const setBaseDateMs = useCalendarStore((s) => s.setBaseDateMs);
  const baseDate = new Date(baseDateMs);
  const monthLabel = `${baseDate.getFullYear()}. ${String(baseDate.getMonth() + 1).padStart(2, '0')}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateString(today);

  const earliestStr = streakDates.length ? streakDates.reduce((a, b) => (a < b ? a : b)) : todayStr;
  const [ey, em, ed] = earliestStr.split('-').map(Number);
  const earliestDate = ey && em && ed ? new Date(ey, em - 1, ed) : today;
  const firstOfFocusMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const earliestOrToday = earliestDate.getTime() < today.getTime() ? earliestDate : today;
  const rangeStartAnchor =
    earliestOrToday.getTime() < firstOfFocusMonth.getTime() ? earliestOrToday : firstOfFocusMonth;
  const rangeStart = startOfWeek(rangeStartAnchor);
  const futureAnchor = baseDate.getTime() > today.getTime() ? baseDate : today;
  const rangeEndWeek = startOfWeek(
    new Date(futureAnchor.getFullYear(), futureAnchor.getMonth() + 2, 0),
  );
  const rangeStartMs = rangeStart.getTime();
  const rangeEndMs = rangeEndWeek.getTime();

  const baseWeekMs = startOfWeek(baseDate).getTime();
  const firstWeekOfMonthMs = startOfWeek(
    new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
  ).getTime();

  const canPrev = view === 'week' ? baseWeekMs > rangeStartMs : firstWeekOfMonthMs > rangeStartMs;
  const canNext = true;

  const handlePrevClick = () => {
    if (!canPrev) return;
    if (view === 'week') {
      setBaseDateMs(addDays(baseDate, -7).getTime());
    } else {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() - 1);
      setBaseDateMs(d.getTime());
    }
  };

  const handleNextClick = () => {
    if (!canNext) return;
    if (view === 'week') {
      setBaseDateMs(addDays(baseDate, 7).getTime());
    } else {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + 1);
      setBaseDateMs(d.getTime());
    }
  };

  const handleWeekClick = () => setView('week');
  const handleMonthClick = () => setView('month');

  const handleDaySelect = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y && m && d) setBaseDateMs(new Date(y, m - 1, d).getTime());
    onDaySelect?.(dateStr);
  };

  const handleTodayClick = () => {
    setBaseDateMs(today.getTime());
    onDaySelect?.(todayStr);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center px-[2rem] pb-[0.8rem]">
        <div className="relative flex items-center rounded-full bg-gray-alpha-50 px-[0.5rem] py-[0.4rem] shadow-[inset_0px_0px_4px_0px_rgba(23,28,27,0.03)]">
          <div
            aria-hidden
            className={cn(
              'absolute bottom-[0.4rem] left-[0.5rem] top-[0.4rem] w-[calc(50%-0.5rem)] rounded-full bg-text-default drop-shadow-[0px_0px_1.5px_rgba(0,0,0,0.25)] transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
              view === 'month' && 'translate-x-full',
            )}
          />
          <button
            type="button"
            onClick={handleWeekClick}
            className={cn(
              'relative z-10 flex-1 cursor-pointer rounded-full px-[1rem] py-[0.6rem] text-center text-caption1 font-semibold leading-none tracking-[-0.024em] transition-colors duration-200',
              view === 'week' ? 'text-white' : 'text-text-caption',
            )}
          >
            주
          </button>
          <button
            type="button"
            onClick={handleMonthClick}
            className={cn(
              'relative z-10 flex-1 cursor-pointer rounded-full px-[1rem] py-[0.6rem] text-center text-caption1 font-semibold leading-none tracking-[-0.024em] transition-colors duration-200',
              view === 'month' ? 'text-white' : 'text-text-caption',
            )}
          >
            월
          </button>
        </div>

        <button
          type="button"
          aria-label="오늘로 이동"
          onClick={handleTodayClick}
          className="body2-bold min-w-0 flex-1 cursor-pointer whitespace-nowrap px-[1rem] text-left tracking-[-0.042rem] text-text-caption"
        >
          {monthLabel}
        </button>

        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            aria-label="이전"
            disabled={!canPrev}
            onClick={handlePrevClick}
            className="flex cursor-pointer items-center justify-center disabled:cursor-default disabled:opacity-30"
          >
            <ChevronIcon className="rotate-90 size-[2rem] fill-text-caption" />
          </button>
          <button
            type="button"
            aria-label="다음"
            disabled={!canNext}
            onClick={handleNextClick}
            className="flex cursor-pointer items-center justify-center disabled:cursor-default disabled:opacity-30"
          >
            <ChevronIcon className="-rotate-90 size-[2rem] fill-text-caption" />
          </button>
        </div>
      </div>

      <MonthCalendar
        baseDateMs={baseDateMs}
        view={view}
        rangeStartMs={rangeStartMs}
        rangeEndMs={rangeEndMs}
        streakDates={streakDates}
        todayDate={today}
        selectedDate={selectedDate}
        onDayClick={handleDaySelect}
      />
    </div>
  );
};

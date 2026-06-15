'use client';

import { useEffect, useState } from 'react';
import { DAY_LABELS } from '@/constants';
import { cn, toLocalDateString } from '@/lib';

type DayState = 'default' | 'active' | 'future' | 'disabled';

type DayCell = {
  date: number;
  dateStr: string;
  isCurrentMonth: boolean;
  state: DayState;
  isToday: boolean;
};

type WeekRow = {
  key: string;
  days: DayCell[];
};

type Props = {
  baseDateMs: number;
  view: 'week' | 'month';
  rangeStartMs: number;
  rangeEndMs: number;
  streakDates?: string[];
  todayDate?: Date;
  selectedDate?: string;
  className?: string;
  /** 세션 로드가 끝나 스트립 위치가 안정된 뒤에만 true. 마운트·데이터 로드 중에는 transition을 끈다. */
  ready?: boolean;
  onDayClick?: (dateStr: string) => void;
};

const ROW_HEIGHT_REM = 6.2;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

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

const weekDiff = (fromMs: number, toMs: number) => Math.round((toMs - fromMs) / MS_PER_WEEK);

const buildStrip = (
  rangeStartMs: number,
  weekCount: number,
  focusYear: number,
  focusMonth: number,
  streakSet: Set<string>,
  todayDate?: Date,
): WeekRow[] => {
  const rangeStart = new Date(rangeStartMs);
  const rows: WeekRow[] = [];

  for (let w = 0; w < weekCount; w++) {
    const weekStart = addDays(rangeStart, w * 7);
    const days: DayCell[] = [];

    for (let i = 0; i < 7; i++) {
      const cellDate = addDays(weekStart, i);
      const dateStr = toLocalDateString(cellDate);
      const isCurrentMonth =
        cellDate.getFullYear() === focusYear && cellDate.getMonth() === focusMonth;
      const isFuture = todayDate !== undefined && cellDate > todayDate;
      const isToday =
        todayDate !== undefined &&
        cellDate.getFullYear() === todayDate.getFullYear() &&
        cellDate.getMonth() === todayDate.getMonth() &&
        cellDate.getDate() === todayDate.getDate();
      const state: DayState = !isCurrentMonth
        ? 'disabled'
        : isFuture
          ? 'future'
          : streakSet.has(dateStr)
            ? 'active'
            : 'default';

      days.push({ date: cellDate.getDate(), dateStr, isCurrentMonth, state, isToday });
    }

    rows.push({ key: toLocalDateString(weekStart), days });
  }

  return rows;
};

export const MonthCalendar = (props: Props) => {
  const {
    baseDateMs,
    view,
    rangeStartMs,
    rangeEndMs,
    streakDates = [],
    todayDate,
    selectedDate,
    className,
    ready = false,
    onDayClick,
  } = props;

  // 데이터 로드로 위치가 안정된 다음 프레임부터만 transition을 켜서,
  // 마운트·streakDates 도착에 따른 초기 위치 보정이 애니메이션 없이 즉시 반영되게 한다.
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (!ready || animate) {
      return;
    }
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [ready, animate]);

  const baseDate = new Date(baseDateMs);
  const focusYear = baseDate.getFullYear();
  const focusMonth = baseDate.getMonth();

  const weekCount = weekDiff(rangeStartMs, rangeEndMs) + 1;
  const streakSet = new Set(streakDates);
  const weeks = buildStrip(rangeStartMs, weekCount, focusYear, focusMonth, streakSet, todayDate);

  const isWeek = view === 'week';

  // 스트립 안에서 각 뷰가 상단에 보여줄 주 인덱스
  const baseWeekIndex = weekDiff(rangeStartMs, startOfWeek(baseDate).getTime());
  const firstWeekOfMonth = startOfWeek(new Date(focusYear, focusMonth, 1));
  const firstWeekIndex = weekDiff(rangeStartMs, firstWeekOfMonth.getTime());

  const daysInMonth = new Date(focusYear, focusMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(focusYear, focusMonth, 1).getDay() + 6) % 7;
  const monthWeekCount = Math.ceil((firstDayIndex + daysInMonth) / 7);

  const topIndex = isWeek ? baseWeekIndex : firstWeekIndex;
  const visibleRows = isWeek ? 1 : monthWeekCount;

  return (
    <div
      className={cn(
        'w-full overflow-hidden',
        animate && 'transition-[height] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        className,
      )}
      style={{ height: `${visibleRows * ROW_HEIGHT_REM}rem` }}
    >
      <div
        className={cn(
          'flex flex-col',
          animate && 'transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        )}
        style={{ transform: `translateY(-${topIndex * ROW_HEIGHT_REM}rem)` }}
      >
        {weeks.map((week) => (
          <div
            key={week.key}
            className="flex w-full shrink-0 items-center px-[1.4rem]"
            style={{ height: `${ROW_HEIGHT_REM}rem` }}
          >
            {week.days.map((cell, dayIndex) => {
              const isSelected = cell.isCurrentMonth && cell.dateStr === selectedDate;
              const isClickable = cell.isCurrentMonth && cell.state !== 'future';
              const handleClick = () => {
                if (isClickable) onDayClick?.(cell.dateStr);
              };

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  disabled={!isClickable}
                  onClick={handleClick}
                  className={cn(
                    'flex min-w-0 flex-1 flex-col items-center gap-[0.4rem] rounded-[10px] py-[0.6rem]',
                    'cursor-pointer disabled:cursor-default',
                    isSelected && 'bg-gray-alpha-50',
                    !cell.isCurrentMonth && 'opacity-30',
                  )}
                >
                  <span className="shrink-0 text-center text-[1rem] font-semibold leading-[1.4] tracking-[-0.02em] text-text-caption">
                    {DAY_LABELS[dayIndex]}
                  </span>
                  <div
                    className={cn(
                      'relative flex size-[3.2rem] shrink-0 items-center justify-center overflow-hidden rounded-full',
                      cell.state === 'default' && !isSelected && 'bg-gray-alpha-10',
                      cell.state === 'active' && 'bg-green-darkest',
                      (cell.state === 'future' || cell.state === 'disabled') && 'bg-white',
                    )}
                  >
                    <span
                      className={cn(
                        'body2-bold text-center tracking-[-0.03em] [paint-order:stroke_fill] [-webkit-text-stroke:0.8px_currentColor]',
                        cell.state === 'default' && 'text-text-description',
                        cell.state === 'active' &&
                          'text-white [text-shadow:0px_0px_1.125px_rgba(0,0,0,0.32)]',
                        (cell.state === 'future' || cell.state === 'disabled') && 'text-gray-100',
                      )}
                    >
                      {cell.date}
                    </span>
                    {cell.state === 'active' && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_0px_3px_0px_rgba(255,255,255,0.8)]"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

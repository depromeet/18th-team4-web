'use client';

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

type Props = {
  year: number;
  month: number;
  streakDates?: number[];
  todayDate?: Date;
  className?: string;
  selectedDate?: string;
  activeDate?: string;
  onDayClick?: (dateStr: string) => void;
  view?: 'week' | 'month';
};


const buildWeeks = (
  year: number,
  month: number,
  streakDates: number[],
  todayDate?: Date,
): DayCell[][] => {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  const firstDayIndex = (firstOfMonth.getDay() + 6) % 7;

  const cells: DayCell[] = [];
  const streakSet = new Set(streakDates);

  for (let i = 0; i < firstDayIndex; i++) {
    const date = prevMonthDays - firstDayIndex + 1 + i;
    const cellDate = new Date(year, month - 2, date);
    cells.push({
      date,
      dateStr: toLocalDateString(cellDate),
      isCurrentMonth: false,
      state: 'disabled',
      isToday: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month - 1, d);
    const isFuture = todayDate !== undefined && cellDate > todayDate;
    const isToday =
      todayDate !== undefined &&
      todayDate.getFullYear() === year &&
      todayDate.getMonth() + 1 === month &&
      todayDate.getDate() === d;
    cells.push({
      date: d,
      dateStr: toLocalDateString(cellDate),
      isCurrentMonth: true,
      state: isFuture ? 'future' : streakSet.has(d) ? 'active' : 'default',
      isToday,
    });
  }

  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const cellDate = new Date(year, month, d);
    cells.push({
      date: d,
      dateStr: toLocalDateString(cellDate),
      isCurrentMonth: false,
      state: 'disabled',
      isToday: false,
    });
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
};

export const MonthCalendar = (props: Props) => {
  const {
    year,
    month,
    streakDates = [],
    todayDate,
    className,
    selectedDate,
    activeDate,
    onDayClick,
    view = 'month',
  } = props;
  const weeks = buildWeeks(year, month, streakDates, todayDate);

  const activeRowDate = activeDate ?? selectedDate;
  const activeRowIndex = Math.max(
    0,
    weeks.findIndex((week) =>
      week.some((cell) => cell.isCurrentMonth && cell.dateStr === activeRowDate),
    ),
  );
  const isWeek = view === 'week';

  return (
    <div className={cn('flex w-full flex-col', className)}>
      {weeks.map((week, weekIndex) => (
        <div
          key={week[0]?.dateStr}
          className={cn(
            'grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
            isWeek && weekIndex !== activeRowIndex ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="flex w-full items-center px-[1.4rem]">
          {week.map((cell, dayIndex) => {
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
          </div>
        </div>
      ))}
    </div>
  );
};

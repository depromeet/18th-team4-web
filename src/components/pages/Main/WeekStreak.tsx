'use client';

import { cn } from '@/lib';

type DayState = 'default' | 'active' | 'future';

type DayItem = {
  label: string;
  date: number;
  dateStr: string;
  state: DayState;
  isToday?: boolean;
};

type Props = {
  days: DayItem[];
  className?: string;
  selectedDate?: string;
  onDayClick?: (dateStr: string) => void;
};

export const WeekStreak = (props: Props) => {
  const { days, className, selectedDate, onDayClick } = props;

  return (
    <div className={cn('flex w-full items-center px-[1.4rem]', className)}>
      {days.map((day) => {
        const isSelected = day.dateStr === selectedDate;
        return (
          <button
            key={day.label}
            type="button"
            disabled={day.state === 'future'}
            onClick={() => onDayClick?.(day.dateStr)}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center gap-[0.4rem] rounded-[10px] py-[0.6rem]',
              'cursor-pointer disabled:cursor-default',
              isSelected && 'bg-gray-alpha-50',
            )}
          >
            <span className="shrink-0 text-center text-[1rem] font-semibold leading-[1.4] tracking-[-0.02em] text-text-caption">
              {day.label}
            </span>
            <div
              className={cn(
                'relative flex size-[3.2rem] shrink-0 items-center justify-center overflow-hidden rounded-full',
                day.state === 'default' && !isSelected && 'bg-gray-alpha-10',
                day.state === 'active' && 'bg-green-darkest',
              )}
            >
              <span
                className={cn(
                  'body2-bold text-center tracking-[-0.03em] [paint-order:stroke_fill] [-webkit-text-stroke:0.8px_currentColor]',
                  day.state === 'default' && 'text-text-description',
                  day.state === 'active' && 'text-white [text-shadow:0px_0px_1.125px_rgba(0,0,0,0.32)]',
                  day.state === 'future' && 'text-gray-100',
                )}
              >
                {day.date}
              </span>
              {day.state === 'active' && (
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
  );
};

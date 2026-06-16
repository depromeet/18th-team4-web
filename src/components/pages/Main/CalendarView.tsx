'use client';

import { type MutableRefObject, useEffect, useRef, useState } from 'react';
import { BottomSheet, ChevronIcon } from '@/components';
import { cn, toLocalDateString, useCalendarStore } from '@/lib';
import { MonthCalendar } from './MonthCalendar';

type Props = {
  streakDates?: string[];
  selectedDate?: string;
  ready?: boolean;
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

const MIN_YEAR = 2026;
const MIN_MONTH_INDEX = 5;
const YEAR_SLOT_RADIUS = 10;
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const MIN_CALENDAR_DATE = new Date(MIN_YEAR, MIN_MONTH_INDEX, 1);

const getCenteredSlotValue = (container: HTMLDivElement | null) => {
  if (!container) return null;

  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-slot-value]'));
  const centerY = container.scrollTop + container.clientHeight / 2;
  let closestValue: number | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  buttons.forEach((button) => {
    const value = Number(button.dataset.slotValue);
    if (!Number.isFinite(value)) return;

    const buttonCenterY = button.offsetTop + button.offsetHeight / 2;
    const distance = Math.abs(centerY - buttonCenterY);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestValue = value;
    }
  });

  return closestValue;
};

const clampToMinCalendarDate = (date: Date) =>
  date.getTime() < MIN_CALENDAR_DATE.getTime() ? new Date(MIN_CALENDAR_DATE) : date;

export const CalendarView = (props: Props) => {
  const { streakDates = [], selectedDate, ready = false, onDaySelect } = props;
  const view = useCalendarStore((s) => s.view);
  const setView = useCalendarStore((s) => s.setView);

  // localStorage에 저장된 주/월 선택을 마운트 후 적용(persist skipHydration 대응).
  useEffect(() => {
    void useCalendarStore.persist.rehydrate();
  }, []);
  const baseDateMs = useCalendarStore((s) => s.baseDateMs);
  const setBaseDateMs = useCalendarStore((s) => s.setBaseDateMs);
  const baseDate = new Date(baseDateMs);
  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [draftYear, setDraftYear] = useState(baseYear);
  const [draftMonth, setDraftMonth] = useState(baseMonth + 1);
  const yearListRef = useRef<HTMLDivElement | null>(null);
  const monthListRef = useRef<HTMLDivElement | null>(null);
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  const selectedMonthRef = useRef<HTMLButtonElement | null>(null);
  const yearScrollRafRef = useRef<number | null>(null);
  const monthScrollRafRef = useRef<number | null>(null);
  const currentYear = new Date().getFullYear();
  const startYear = MIN_YEAR;
  const endYear = Math.max(currentYear, baseYear) + YEAR_SLOT_RADIUS;
  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
  const monthOptions = MONTHS.filter(
    (month) => draftYear > MIN_YEAR || month >= MIN_MONTH_INDEX + 1,
  );
  const monthLabel = `${baseYear}. ${String(baseMonth + 1).padStart(2, '0')}`;
  const minCalendarMonthMs = MIN_CALENDAR_DATE.getTime();

  useEffect(() => {
    if (!isMonthPickerOpen) return;

    const id = requestAnimationFrame(() => {
      selectedYearRef.current?.scrollIntoView({ block: 'center' });
      selectedMonthRef.current?.scrollIntoView({ block: 'center' });
    });

    return () => cancelAnimationFrame(id);
  }, [isMonthPickerOpen]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateString(today);

  const earliestStr = streakDates.length ? streakDates.reduce((a, b) => (a < b ? a : b)) : todayStr;
  const [ey, em, ed] = earliestStr.split('-').map(Number);
  const earliestDate = ey && em && ed ? new Date(ey, em - 1, ed) : today;
  const firstOfFocusMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const firstOfTodayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const earliestOrToday = earliestDate.getTime() < today.getTime() ? earliestDate : today;
  const monthRangeStartAnchor =
    earliestOrToday.getTime() < firstOfFocusMonth.getTime() ? earliestOrToday : firstOfFocusMonth;
  const weekRangeStartAnchor =
    earliestOrToday.getTime() < firstOfTodayMonth.getTime() ? earliestOrToday : firstOfTodayMonth;
  const rangeStartAnchor = view === 'week' ? weekRangeStartAnchor : monthRangeStartAnchor;
  const rangeStart = startOfWeek(rangeStartAnchor);
  const futureAnchor = baseDate.getTime() > today.getTime() ? baseDate : today;
  const rangeEndWeek = startOfWeek(
    new Date(futureAnchor.getFullYear(), futureAnchor.getMonth() + 2, 0),
  );
  const rangeStartMs = rangeStart.getTime();
  const rangeEndMs = rangeEndWeek.getTime();

  const prevWeekDate = addDays(baseDate, -7);
  const prevMonthDate = new Date(baseYear, baseMonth - 1, 1);
  const canPrev = firstOfFocusMonth.getTime() > minCalendarMonthMs;
  const canNext = true;

  const handlePrevClick = () => {
    if (!canPrev) return;
    if (view === 'week') {
      setBaseDateMs(clampToMinCalendarDate(prevWeekDate).getTime());
    } else {
      setBaseDateMs(clampToMinCalendarDate(prevMonthDate).getTime());
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

  const openMonthPicker = () => {
    setDraftYear(Math.max(baseYear, MIN_YEAR));
    setDraftMonth(baseMonth + 1);
    setIsMonthPickerOpen(true);
  };

  const closeMonthPicker = () => setIsMonthPickerOpen(false);

  const setDraftYearSafely = (year: number) => {
    setDraftYear(year);
    if (year === MIN_YEAR && draftMonth < MIN_MONTH_INDEX + 1) {
      setDraftMonth(MIN_MONTH_INDEX + 1);
    }
  };

  const syncCenteredSlotValues = () => {
    const centeredYear = getCenteredSlotValue(yearListRef.current);
    const centeredMonth = getCenteredSlotValue(monthListRef.current);

    if (centeredYear !== null) setDraftYear(centeredYear);
    if (centeredMonth !== null) setDraftMonth(centeredMonth);

    return {
      year: centeredYear ?? draftYear,
      month: centeredMonth ?? draftMonth,
    };
  };

  const scheduleSlotSync = (
    container: HTMLDivElement | null,
    setValue: (value: number) => void,
    rafRef: MutableRefObject<number | null>,
  ) => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const centeredValue = getCenteredSlotValue(container);
      if (centeredValue !== null) setValue(centeredValue);
    });
  };

  const handleApplyMonthPicker = () => {
    const { month, year } = syncCenteredSlotValues();
    const nextDate = clampToMinCalendarDate(new Date(year, month - 1, 1));
    setBaseDateMs(nextDate.getTime());
    onDaySelect?.(toLocalDateString(nextDate));
    setIsMonthPickerOpen(false);
  };

  const handleDaySelect = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return;

    const nextDate = clampToMinCalendarDate(new Date(y, m - 1, d));
    setBaseDateMs(nextDate.getTime());
    onDaySelect?.(toLocalDateString(nextDate));
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
          onClick={openMonthPicker}
          className="body2-bold min-w-0 flex-1 cursor-pointer whitespace-nowrap px-[1rem] text-left tracking-[-0.042rem] text-text-caption"
          aria-label={`${monthLabel} 연월 선택`}
        >
          {monthLabel}
        </button>

        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            aria-label="오늘로 이동"
            onClick={handleTodayClick}
            className="caption1-bold flex h-[3.2rem] cursor-pointer items-center rounded-full border border-gray-alpha-50 bg-white px-[1.1rem] text-text-description"
          >
            오늘
          </button>
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
        ready={ready}
        onDayClick={handleDaySelect}
      />

      <BottomSheet
        open={isMonthPickerOpen}
        ariaLabel="연월 선택"
        collapsedMaxHeight="0px"
        onClose={closeMonthPicker}
      >
        <section className="flex min-h-0 flex-col px-[2.4rem] pb-[2.4rem] pt-[2rem]">
          <div className="mb-[1.6rem] flex items-center justify-between">
            <h2 className="title1-bold tracking-[-0.04em] text-text-default">연월 선택</h2>
          </div>

          <div className="relative grid h-[22rem] grid-cols-2 gap-[1.2rem] overflow-hidden rounded-[2rem] bg-gray-alpha-10 px-[1.2rem] py-[1.2rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-[1.2rem] right-[1.2rem] top-1/2 h-[4.4rem] -translate-y-1/2 rounded-[1.4rem] bg-white shadow-[0_0_12px_rgba(23,28,27,0.06)]"
            />

            <div
              ref={yearListRef}
              className="scrollbar-hide relative z-10 flex flex-col gap-[0.4rem] overflow-y-auto py-[7.8rem] [scroll-snap-type:y_mandatory]"
              onScroll={(event) =>
                scheduleSlotSync(event.currentTarget, setDraftYearSafely, yearScrollRafRef)
              }
            >
              {yearOptions.map((year) => (
                <button
                  key={year}
                  ref={draftYear === year ? selectedYearRef : undefined}
                  type="button"
                  data-slot-value={year}
                  onClick={(event) => {
                    setDraftYearSafely(year);
                    event.currentTarget.scrollIntoView({ block: 'center' });
                  }}
                  className={cn(
                    'title1-bold flex h-[4rem] shrink-0 cursor-pointer items-center justify-center rounded-[1.2rem] text-center tracking-[-0.04em] [scroll-snap-align:center]',
                    draftYear === year ? 'text-text-default' : 'text-text-disable',
                  )}
                >
                  {year}
                </button>
              ))}
            </div>

            <div
              ref={monthListRef}
              className="scrollbar-hide relative z-10 flex flex-col gap-[0.4rem] overflow-y-auto py-[7.8rem] [scroll-snap-type:y_mandatory]"
              onScroll={(event) =>
                scheduleSlotSync(event.currentTarget, setDraftMonth, monthScrollRafRef)
              }
            >
              {monthOptions.map((month) => (
                <button
                  key={month}
                  ref={draftMonth === month ? selectedMonthRef : undefined}
                  type="button"
                  data-slot-value={month}
                  onClick={(event) => {
                    setDraftMonth(month);
                    event.currentTarget.scrollIntoView({ block: 'center' });
                  }}
                  className={cn(
                    'title1-bold flex h-[4rem] shrink-0 cursor-pointer items-center justify-center rounded-[1.2rem] text-center tracking-[-0.04em] [scroll-snap-align:center]',
                    draftMonth === month ? 'text-text-default' : 'text-text-disable',
                  )}
                >
                  {String(month).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyMonthPicker}
            className="btn-appear title1-bold mt-[1.6rem] flex h-[5.6rem] w-full cursor-pointer items-center justify-center rounded-[1.6rem] bg-text-default text-white"
          >
            확인
          </button>
        </section>
      </BottomSheet>
    </div>
  );
};

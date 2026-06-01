import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toLocalDateString } from '../utils';

type CalendarView = 'week' | 'month';

type CalendarState = {
  selectedDate: string;
  view: CalendarView;
  baseDateMs: number;
  setSelectedDate: (date: string) => void;
  setView: (view: CalendarView) => void;
  setBaseDateMs: (ms: number) => void;
};

export const useCalendarStore = create<CalendarState>()(
  devtools(
    (set) => ({
      selectedDate: toLocalDateString(new Date()),
      view: 'week',
      baseDateMs: Date.now(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setView: (view) => set({ view }),
      setBaseDateMs: (ms) => set({ baseDateMs: ms }),
    }),
    { name: 'calendarStore' },
  ),
);

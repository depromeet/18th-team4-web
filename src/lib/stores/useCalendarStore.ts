import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { toLocalDateString } from '@/lib';

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
    persist(
      (set) => ({
        selectedDate: toLocalDateString(new Date()),
        view: 'week',
        baseDateMs: Date.now(),
        setSelectedDate: (date) => set({ selectedDate: date }),
        setView: (view) => set({ view }),
        setBaseDateMs: (ms) => set({ baseDateMs: ms }),
      }),
      {
        name: 'readum:calendarView',
        storage: createJSONStorage(() => localStorage),
        // 새로고침에도 유지할 값은 view(주/월)만. selectedDate·baseDateMs는 열 때 오늘 기준으로 초기화.
        partialize: (state) => ({ view: state.view }),
        // SSR 기본값(week)으로 첫 렌더 → 마운트 후 rehydrate로 저장값 적용해 hydration mismatch 방지.
        skipHydration: true,
      },
    ),
    { name: 'calendarStore' },
  ),
);

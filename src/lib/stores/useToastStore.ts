import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ToastType = 'error';

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
};

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 2000;

type ToastState = {
  toasts: ToastItem[];
  openToast: (toast: { type: ToastType; message: string; duration?: number }) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

export const useToastStore = create<ToastState>()(
  devtools(
    (set, get) => ({
      toasts: [],
      openToast: ({ type, message, duration = DEFAULT_DURATION }) => {
        const id = crypto.randomUUID();
        set((state) => {
          const next = [...state.toasts, { id, type, message, duration }];
          return { toasts: next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next };
        });
        return id;
      },
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      clearToasts: () => set({ toasts: [] }),
    }),
    { name: 'toastStore' },
  ),
);

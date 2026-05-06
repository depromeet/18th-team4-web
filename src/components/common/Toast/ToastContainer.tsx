'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/lib/stores';
import { Toast } from './Toast';

const ToastTimer = ({ id, duration }: { id: string; duration: number }) => {
  const dismissToast = useToastStore((s) => s.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dismissToast]);

  return null;
};

export const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-150 flex-col items-center gap-[0.8rem] px-[2.4rem] pt-[2.4rem]"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full flex justify-center">
          <ToastTimer id={toast.id} duration={toast.duration} />
          <Toast type={toast.type} message={toast.message} />
        </div>
      ))}
    </div>
  );
};

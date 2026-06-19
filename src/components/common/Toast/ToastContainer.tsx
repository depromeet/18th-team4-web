'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/lib';
import { Toast } from './Toast';

type ToastTimerProps = {
  id: string;
  duration: number;
};

const ToastTimer = (props: ToastTimerProps) => {
  const { id, duration } = props;
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-mobile-responsive flex-col items-center gap-[0.8rem] overflow-visible px-[2.4rem] pt-[2.4rem]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full justify-center overflow-visible"
        >
          <ToastTimer id={toast.id} duration={toast.duration} />
          <Toast type={toast.type} message={toast.message} />
        </div>
      ))}
    </div>
  );
};

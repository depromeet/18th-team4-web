import { type ReactNode } from 'react';
import { WarningIcon } from '@/components';
import { cn } from '@/lib';
import { toastGlowVariants, toastIconVariants, type ToastType } from './toastVariants';

const TOAST_ICON: Record<ToastType, (className: string) => ReactNode> = {
  error: (className) => <WarningIcon className={className} />,
};

const TOAST_ROLE: Record<ToastType, 'alert' | 'status'> = {
  error: 'alert',
};

type Props = {
  type: ToastType;
  message: string;
  className?: string;
};

export const Toast = (props: Props) => {
  const { type, message, className } = props;

  return (
    <div
      role={TOAST_ROLE[type]}
      className={cn(
        'animate-toast-in relative flex items-center gap-[0.6rem] px-[1.4rem] py-[1.6rem] rounded-[100px] bg-white border border-white shadow-[0_0_3.2rem_rgba(0,0,0,0.16)] overflow-hidden max-w-full min-w-0',
        className,
      )}
    >
      <div className={toastGlowVariants({ type })} aria-hidden />
      {TOAST_ICON[type](toastIconVariants({ type }))}
      <p className="body2-bold tracking-[-0.03em] text-text-default break-keep min-w-0">
        {message}
      </p>
    </div>
  );
};

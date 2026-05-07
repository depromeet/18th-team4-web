import { cva } from 'class-variance-authority';

export type ToastType = 'error';

export const toastGlowVariants = cva(
  'absolute -left-[0.5rem] -top-[0.5rem] size-[5.1rem] rounded-full opacity-15 blur-sm',
  {
    variants: {
      type: {
        error: 'bg-negative',
      },
    },
    defaultVariants: { type: 'error' },
  },
);

export const toastIconVariants = cva('relative shrink-0 size-[2rem]', {
  variants: {
    type: {
      error: 'fill-negative',
    },
  },
  defaultVariants: { type: 'error' },
});

import { cva } from 'class-variance-authority';

export type ToastType = 'error' | 'success';

export const toastGlowVariants = cva(
  'absolute -left-[0.5rem] -top-[0.5rem] size-[5.1rem] rounded-full opacity-15 blur-sm',
  {
    variants: {
      type: {
        error: 'bg-negative',
        success: 'bg-green-darkest',
      },
    },
    defaultVariants: { type: 'error' },
  },
);

export const toastIconVariants = cva('relative shrink-0 size-[2rem]', {
  variants: {
    type: {
      error: 'fill-negative',
      success: 'fill-green-darkest',
    },
  },
  defaultVariants: { type: 'error' },
});

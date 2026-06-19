import { cva } from 'class-variance-authority';

export type ToastType = 'error' | 'success';

export const toastGlowVariants = cva('pointer-events-none absolute inset-0 rounded-[inherit]', {
  variants: {
    type: {
      error:
        'bg-[radial-gradient(circle_at_2.4rem_50%,rgba(230,90,90,0.18)_0%,rgba(230,90,90,0.1)_34%,rgba(230,90,90,0)_72%)]',
      success:
        'bg-[radial-gradient(circle_at_2.4rem_50%,rgba(4,22,20,0.16)_0%,rgba(4,22,20,0.08)_34%,rgba(4,22,20,0)_72%)]',
    },
  },
  defaultVariants: { type: 'error' },
});

export const toastIconVariants = cva('relative shrink-0 size-[2rem]', {
  variants: {
    type: {
      error: 'fill-negative',
      success: 'fill-green-darkest',
    },
  },
  defaultVariants: { type: 'error' },
});

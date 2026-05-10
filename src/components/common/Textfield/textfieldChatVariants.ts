import { cva } from 'class-variance-authority';

export const containerVariants = cva(
  'flex items-center justify-center gap-[2rem] pl-[2.4rem] pr-[1.6rem] py-[1.6rem] rounded-[2.4rem] w-full',
  {
    variants: {
      bgVariant: {
        gray: 'bg-background-primary-base',
        white: 'bg-background-primary-white shadow-[0px_0px_32px_rgba(0,0,0,0.08)]',
      },
      status: {
        default: '',
        disabled: '',
        error: 'border border-negative',
        loading: '',
      },
    },
    defaultVariants: {
      bgVariant: 'gray',
      status: 'default',
    },
  },
);

export const inputVariants = cva(
  'body1-medium placeholder:text-text-caption placeholder:body1-medium py-[0.6rem]',
  {
    variants: {
      status: {
        default: 'text-text-default',
        disabled: 'placeholder:text-text-disable',
        error: 'text-negative placeholder:text-negative',
        loading: 'placeholder:text-text-disable',
      },
    },
    defaultVariants: { status: 'default' },
  },
);

export const sendButtonVariants = cva('cursor-pointer', {
  variants: {
    status: {
      default: 'text-text-default',
      disabled: 'cursor-not-allowed text-icon-disabled',
      error: 'text-icon-disabled',
      loading:
        'flex size-[3.6rem] shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-icon-disabled/40',
    },
  },
  defaultVariants: { status: 'default' },
});

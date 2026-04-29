import { cva } from 'class-variance-authority';

export const containerVariants = cva(
  'flex items-center justify-center gap-[2rem] pl-[2.4rem] pr-[1.6rem] py-[2.2rem] rounded-[2.4rem] w-full',
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
      },
    },
    defaultVariants: {
      bgVariant: 'gray',
      status: 'default',
    },
  },
);

export const inputVariants = cva(
  'body1-medium placeholder:text-text-caption placeholder:body1-medium',
  {
    variants: {
      status: {
        default: 'text-text-default',
        disabled: 'placeholder:text-text-disable',
        error: 'text-negative placeholder:text-negative',
      },
    },
    defaultVariants: { status: 'default' },
  },
);

export const sendButtonVariants = cva('', {
  variants: {
    status: {
      default: 'text-text-default',
      disabled: 'text-icon-disabled cursor-not-allowed',
      error: 'text-icon-disabled',
    },
  },
  defaultVariants: { status: 'default' },
});

import { cva } from 'class-variance-authority';

export type ButtonVariant = 'default';
export type ButtonSize = 'default';

export const buttonVariants = cva(
  '',

  {
    variants: {
      variant: {
        default: '',
      },
      size: {
        default: '',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

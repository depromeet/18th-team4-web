import { cva } from 'class-variance-authority';

export const BUTTON_VARIANT = {
  BLACK: 'black',
  GRAY: 'gray',
  RED: 'red',
  LIGHTGRAY: 'lightgray',
} as const;

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
export type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

export const buttonVariants = cva(
  'flex items-center justify-center',

  {
    variants: {
      variant: {
        black: 'bg-gray-900 text-text-white',
        gray: 'bg-gray-50 text-text-disable',
        red: 'bg-negative text-text-white',
        lightgray: 'bg-gray-10 text-text-default',
      },
      size: {
        sm: 'h-[3.7rem] w-full max-w-[8.4rem] rounded-xl body2-bold',
        md: 'h-[5.6rem] w-full max-w-[13.7rem] rounded-2xl body1-bold',
        lg: 'w-full h-[6rem] rounded-2xl body1-bold ',
        full: 'w-full h-[6rem] title1-bold',
      },
    },

    defaultVariants: {
      variant: 'black',
      size: 'md',
    },
  },
);

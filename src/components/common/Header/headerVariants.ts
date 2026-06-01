import { cva } from 'class-variance-authority';

export const HEADER_VARIANT = {
  HOME: 'home',
  BACK: 'back',
  CHAT: 'chat',
} as const;

export type HeaderVariant = (typeof HEADER_VARIANT)[keyof typeof HEADER_VARIANT];

export const headerVariants = cva('sticky top-0 z-40 flex w-full items-center', {
  variants: {
    variant: {
      [HEADER_VARIANT.HOME]:
        'flex justify-between items-center border-b border-white bg-white/5 backdrop-blur-md px-[2.4rem] py-[1.6rem]',
      [HEADER_VARIANT.BACK]: 'bg-primary-base pl-[1.8rem] pr-[2.4rem] py-[1.8rem]',
      [HEADER_VARIANT.CHAT]:
        'relative justify-between bg-primary-base pl-[1.8rem] pr-[2.4rem] py-[1.8rem]',
    },
  },
  defaultVariants: {
    variant: HEADER_VARIANT.HOME,
  },
});

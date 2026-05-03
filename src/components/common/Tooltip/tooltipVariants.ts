import { cva } from 'class-variance-authority';

export type TooltipArrowSide = 'top' | 'bottom';
export type TooltipArrowAlignment = 'left' | 'middle' | 'right';

export const tooltipVariants = cva(
  'body2-bold relative inline-block whitespace-nowrap rounded-[0.625rem] bg-gray-800 px-3 py-[0.63rem] text-center text-gray-white tracking-[-0.03em] select-none',
);

export const tooltipArrowVariants = cva(
  'pointer-events-none absolute h-[0.5rem] w-[1.25rem] text-gray-800',
  {
    variants: {
      arrowSide: {
        top: '-top-[0.5rem]',
        bottom: '-bottom-[0.5rem] rotate-180',
      },
      arrowAlignment: {
        left: 'left-[1.31rem]',
        middle: 'left-1/2 -translate-x-1/2',
        right: 'right-[1.31rem]',
      },
    },
    defaultVariants: {
      arrowSide: 'top',
      arrowAlignment: 'middle',
    },
  },
);

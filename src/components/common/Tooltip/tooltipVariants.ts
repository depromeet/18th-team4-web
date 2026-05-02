import { cva } from 'class-variance-authority';

export type TooltipArrowSide = 'top' | 'bottom';
export type TooltipArrowAlignment = 'left' | 'middle' | 'right';

export const tooltipVariants = cva(
  'body2-bold relative inline-block whitespace-nowrap rounded-[10px] bg-gray-800 px-3 py-[10px] text-center text-gray-white tracking-[-0.03em]',
);

export const tooltipArrowVariants = cva(
  'pointer-events-none absolute h-[8px] w-[20px] text-gray-800',
  {
    variants: {
      arrowSide: {
        top: '-top-[8px]',
        bottom: '-bottom-[8px] rotate-180',
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

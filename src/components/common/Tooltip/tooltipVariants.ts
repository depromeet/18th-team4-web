import { cva } from 'class-variance-authority';

export type TooltipArrowSide = 'top';
export type TooltipArrowAlignment = 'left' | 'middle' | 'right';

export const tooltipVariants = cva(
  'body2-bold relative inline-block whitespace-nowrap rounded-[10px] bg-gray-800 px-3 py-[10px] text-center text-gray-white tracking-[-0.03em]',
);

export const tooltipArrowVariants = cva(
  'pointer-events-none absolute h-[8px] w-[41px] text-gray-800',
  {
    variants: {
      arrowSide: {
        top: '-top-[8px]',
      },
      arrowAlignment: {
        left: 'left-3',
        middle: 'left-1/2 -translate-x-1/2',
        right: 'right-3',
      },
    },
    defaultVariants: {
      arrowSide: 'top',
      arrowAlignment: 'middle',
    },
  },
);

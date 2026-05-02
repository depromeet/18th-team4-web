import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib';
import {
  type TooltipArrowAlignment,
  type TooltipArrowSide,
  tooltipArrowVariants,
  tooltipVariants,
} from './tooltipVariants';

export type TooltipProps = Omit<React.ComponentProps<'div'>, 'children' | 'className'> &
  VariantProps<typeof tooltipVariants> &
  VariantProps<typeof tooltipArrowVariants> & {
    arrowClassName?: string;
    content: React.ReactNode;
    arrowSide?: TooltipArrowSide;
    arrowAlignment?: TooltipArrowAlignment;
  };

export const Tooltip = (props: TooltipProps) => {
  const { arrowClassName, content, arrowSide, arrowAlignment, role = 'tooltip', ...rest } = props;

  return (
    <div className={cn(tooltipVariants())} role={role} {...rest}>
      <span
        aria-hidden="true"
        className={cn(tooltipArrowVariants({ arrowSide, arrowAlignment }), arrowClassName)}
      >
        <svg
          className="block size-full"
          viewBox="0 0 20 8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            d="M8.12591 0.65735C9.22157 -0.219175 10.7784 -0.219176 11.8741 0.657349L20 8H0L8.12591 0.65735Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {content}
    </div>
  );
};

import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib';
import {
  type TooltipArrowAlignment,
  type TooltipArrowSide,
  tooltipArrowVariants,
  tooltipVariants,
} from './tooltipVariants';

export type TooltipProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof tooltipVariants> &
  VariantProps<typeof tooltipArrowVariants> & {
    className?: string;
    arrowClassName?: string;
    content: React.ReactNode;
    arrowSide?: TooltipArrowSide;
    arrowAlignment?: TooltipArrowAlignment;
  };

export const Tooltip = (props: TooltipProps) => {
  const {
    className,
    arrowClassName,
    content,
    arrowSide,
    arrowAlignment,
    role = 'tooltip',
    ...rest
  } = props;

  return (
    <div className={cn(tooltipVariants({ className }))} role={role} {...rest}>
      <span
        aria-hidden="true"
        className={cn(tooltipArrowVariants({ arrowSide, arrowAlignment }), arrowClassName)}
      >
        <svg className="block size-full" viewBox="0 0 41 8" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 8C9.25 8 12.5 0 20.5 0C28.5 0 31.75 8 41 8H0Z" fill="currentColor" />
        </svg>
      </span>
      {content}
    </div>
  );
};

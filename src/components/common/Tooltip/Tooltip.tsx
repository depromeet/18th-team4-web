import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TooltipArrow } from '@/assets';
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
      <TooltipArrow
        aria-hidden="true"
        className={cn(tooltipArrowVariants({ arrowSide, arrowAlignment }), arrowClassName)}
      />
      {content}
    </div>
  );
};

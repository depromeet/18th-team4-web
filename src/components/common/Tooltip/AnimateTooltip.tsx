'use client';

import { useEffect, useState } from 'react';
import { Tooltip, type TooltipProps } from '@/components';
import { cn } from '@/lib';

type AnimateTooltipProps = TooltipProps & {
  durationMs?: number;
};

export const AnimateTooltip = (props: AnimateTooltipProps) => {
  const { durationMs = 3000, ...tooltipProps } = props;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <div
      className={cn(
        'transition-opacity duration-300',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <Tooltip {...tooltipProps} />
    </div>
  );
};

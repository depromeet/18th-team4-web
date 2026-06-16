'use client';

import { useEffect, useState } from 'react';
import { Tooltip, type TooltipProps } from '@/components';
import { cn } from '@/lib';

export const AnimateTooltip = (props: TooltipProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleClick = () => setVisible(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div
      className={cn(
        'relative z-10 transition-opacity duration-300',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <Tooltip {...props} />
    </div>
  );
};

import * as React from 'react';
import { cn } from '@/lib';

type BaseInputProps = React.ComponentProps<'input'>;

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('w-full min-w-0 outline-none disabled:cursor-not-allowed', className)}
        {...rest}
      />
    );
  },
);

BaseInput.displayName = 'BaseInput';

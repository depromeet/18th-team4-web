import * as React from 'react';
import { cn } from '@/lib';

type BaseInputProps = React.ComponentProps<'input'>;

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, placeholder, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        placeholder={placeholder}
        className={cn(
          'w-full min-w-0 outline-none disabled:cursor-not-allowed text-text-default',
          className,
        )}
        {...rest}
      />
    );
  },
);

BaseInput.displayName = 'BaseInput';

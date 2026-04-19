import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib';
import { ButtonSize, ButtonVariant, buttonVariants } from './buttonVariants';

type Props = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
  };

export const Button = (props: Props) => {
  const { variant, size, className } = props;

  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};

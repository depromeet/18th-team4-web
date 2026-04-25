import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib';
import { buttonVariants } from './buttonVariants';

type Props = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export const Button = (props: Props) => {
  const { variant, size, className, ...rest } = props;

  return <button className={cn(buttonVariants({ variant, size, className }))} {...rest} />;
};

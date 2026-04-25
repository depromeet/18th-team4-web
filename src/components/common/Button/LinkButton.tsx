import { type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ButtonSize, ButtonVariant, buttonVariants } from './buttonVariants';

type Props = React.ComponentProps<'a'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
    href: string;
  };

export const LinkButton = (props: Props) => {
  const { variant, size, className, ...rest } = props;

  return <Link className={cn(buttonVariants({ variant, size, className }))} {...rest} />;
};

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
    disabled?: boolean;
  };

export const LinkButton = (props: Props) => {
  const { disabled = false, variant, size, className, href, children, ...rest } = props;

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant, size, className }),
        disabled && 'pointer-events-none cursor-not-allowed bg-gray-50 text-text-disable',
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

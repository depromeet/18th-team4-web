import { type SVGProps } from 'react';
import { ColorSymbol } from '@/assets';
import { cn } from '@/lib';

type Props = SVGProps<SVGSVGElement>;

export const ColorSymbolIcon = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <ColorSymbol className={cn('block h-auto w-48 max-w-full shrink-0', className)} {...rest} />
  );
};

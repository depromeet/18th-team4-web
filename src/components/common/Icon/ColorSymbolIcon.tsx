import { type SVGProps } from 'react';
import { ColorSymbol } from '@/assets';
import { cn } from '@/lib';

type Props = SVGProps<SVGSVGElement>;

export const ColorSymbolIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <ColorSymbol className={cn('w-48 h-18', className)} {...rest} />;
};

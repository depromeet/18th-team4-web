import { type SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { ColorSymbol } from '@/assets';

type Props = SVGProps<SVGSVGElement>;

export const ColorSymbolIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <ColorSymbol className={cn('w-48 h-18', className)} {...rest} />;
};

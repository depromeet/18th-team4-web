import { type SVGProps } from 'react';
import { MainSymbol } from '@/assets';
import { cn } from '@/lib';

type Props = SVGProps<SVGSVGElement>;

export const MainSymbolIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <MainSymbol className={cn('w-20 h-[6.6rem]', className)} {...rest} />;
};

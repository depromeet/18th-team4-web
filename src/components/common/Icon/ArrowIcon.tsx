import { type SVGProps } from 'react';
import { Arrow } from '@/assets';
import { cn } from '@/lib/utils';

type Props = SVGProps<SVGSVGElement>;

export const ArrowIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <Arrow className={cn('size-8 fill-black', className)} {...rest} />;
};

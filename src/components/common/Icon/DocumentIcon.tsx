import { type SVGProps } from 'react';
import { Document } from '@/assets';
import { cn } from '@/lib';

type Props = SVGProps<SVGSVGElement>;

export const DocumentIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <Document className={cn('size-[1.4rem]', className)} {...rest} />;
};

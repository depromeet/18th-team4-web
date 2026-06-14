import { type SVGProps } from 'react';
import { Pencil } from '@/assets';
import { cn } from '@/lib';

type Props = SVGProps<SVGSVGElement>;

export const PencilIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <Pencil className={cn('size-8', className)} {...rest} />;
};

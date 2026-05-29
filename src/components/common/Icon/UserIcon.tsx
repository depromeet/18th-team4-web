import { type SVGProps } from 'react';
import { User } from '@/assets';
import { cn } from '@/lib';

type Props = SVGProps<SVGSVGElement>;

export const UserIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <User className={cn('size-8', className)} {...rest} />;
};

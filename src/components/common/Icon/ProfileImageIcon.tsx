import { type SVGProps } from 'react';
import { ProfileImage } from '@/assets';
import { cn } from '@/lib/utils';

type Props = SVGProps<SVGSVGElement>;

export const ProfileImageIcon = (props: Props) => {
  const { className, ...rest } = props;

  return <ProfileImage className={cn('h-8 w-auto', className)} {...rest} />;
};

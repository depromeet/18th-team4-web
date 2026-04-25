import { Dot } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const DotIcon = ({ size = 24, className }: Props) => {
  return (
    <Dot
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

import { Chevron } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const ChevronIcon = ({ size = 24, className }: Props) => {
  return (
    <Chevron
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

import { Reload } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const ReloadIcon = ({ size = 24, className }: Props) => {
  return (
    <Reload
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

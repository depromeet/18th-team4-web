import { Warning } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const WarningIcon = ({ size = 24, className }: Props) => {
  return (
    <Warning
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

import { Plus } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const PlusIcon = ({ size = 24, className }: Props) => {
  return (
    <Plus
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

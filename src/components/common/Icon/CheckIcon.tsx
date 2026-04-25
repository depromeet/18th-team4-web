import { Check } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const CheckIcon = ({ size = 24, className }: Props) => {
  return (
    <Check
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

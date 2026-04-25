import { Menu } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const MenuIcon = ({ size = 24, className }: Props) => {
  return (
    <Menu
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

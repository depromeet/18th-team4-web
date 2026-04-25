import { Search } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  size?: number | string;
  className?: string;
};

export const SearchIcon = ({ size = 24, className }: Props) => {
  return (
    <Search
      width={size}
      height={size}
      className={cn('fill-current', className)}
    />
  );
};

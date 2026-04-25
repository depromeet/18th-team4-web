import { Search } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const SearchIcon = (props: Props) => {
  const { className } = props;

  return <Search className={cn('size-8 fill-black', className)} />;
};

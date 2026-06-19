import { Menu } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const MenuIcon = (props: Props) => {
  const { className } = props;

  return <Menu className={cn('size-8 fill-black', className)} />;
};

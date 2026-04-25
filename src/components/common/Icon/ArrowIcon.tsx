import { Arrow } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const ArrowIcon = (props: Props) => {
  const { className } = props;
  return <Arrow className={cn('size-8 fill-black', className)} />;
};

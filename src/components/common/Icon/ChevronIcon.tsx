import { Chevron } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const ChevronIcon = (props: Props) => {
  const { className } = props;

  return <Chevron className={cn('size-8 fill-black', className)} />;
};

import { Dot } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const DotIcon = (props: Props) => {
  const { className } = props;

  return <Dot className={cn('size-8 fill-black', className)} />;
};

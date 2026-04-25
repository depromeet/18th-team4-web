import { Reload } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const ReloadIcon = (props: Props) => {
  const { className } = props;

  return <Reload className={cn('size-8 fill-black', className)} />;
};

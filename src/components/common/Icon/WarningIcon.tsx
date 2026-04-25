import { Warning } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const WarningIcon = (props: Props) => {
  const { className } = props;

  return <Warning className={cn('size-8 fill-black', className)} />;
};

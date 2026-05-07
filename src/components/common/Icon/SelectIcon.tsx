import { Select } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const SelectIcon = (props: Props) => {
  const { className } = props;

  return <Select className={cn('size-8', className)} />;
};

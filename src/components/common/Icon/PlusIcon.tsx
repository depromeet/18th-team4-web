import { Plus } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const PlusIcon = (props: Props) => {
  const { className } = props;

  return <Plus className={cn('size-8 fill-black', className)} />;
};

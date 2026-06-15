import { Close } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const CloseIcon = (props: Props) => {
  const { className } = props;

  return <Close className={cn('size-8', className)} />;
};

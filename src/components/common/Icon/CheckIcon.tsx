import { Check } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const CheckIcon = (props: Props) => {
  const { className } = props;

  return <Check className={cn('size-8 fill-black', className)} />;
};

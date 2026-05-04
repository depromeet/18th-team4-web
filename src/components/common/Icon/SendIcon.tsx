import { Send } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const SendIcon = (props: Props) => {
  const { className } = props;

  return <Send className={cn('size-8 fill-black', className)} />;
};

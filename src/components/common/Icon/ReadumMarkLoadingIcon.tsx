import { ReadumMarkLg } from '@/assets';
import { cn } from '@/lib';

type Props = {
  className?: string;
};

export const ReadumMarkLoadingIcon = (props: Props) => {
  const { className } = props;
  return <ReadumMarkLg className={cn('text-primary', className)} />;
};

import { Bookmark } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const BookmarkIcon = (props: Props) => {
  const { className } = props;
  return <Bookmark className={cn('size-8 fill-black', className)} />;
};

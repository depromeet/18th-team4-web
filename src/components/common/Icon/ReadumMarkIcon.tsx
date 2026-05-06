import { ReadumMarkSm } from '@/assets';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

/**
 * Readum 워드마크. 색은 `text-*`, 크기는 `w-* h-*`로 조정.
 * TODO: 디자이너 export 후 src/assets/common/svgs/ic-readum-mark.svg 교체.
 */
export const ReadumMarkIcon = (props: Props) => {
  const { className } = props;
  return <ReadumMarkSm className={cn('text-primary', className)} />;
};

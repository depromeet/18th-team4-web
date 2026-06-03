import { chatCardBackgroundColor, type ChatCardColor, chatCardTitleColor } from '@/components';
import { cn } from '@/lib';

type Props = {
  color: ChatCardColor;
  /** 카드 상단 회색 라벨 (책 제목 또는 날짜) */
  label: string;
  summary: string;
  className?: string;
};

export const SummaryRecordCard = (props: Props) => {
  const { color, label, summary, className } = props;

  return (
    <article
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[2rem] border border-white px-[2.4rem] py-[1.8rem]',
        chatCardBackgroundColor[color],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_32px_0px_rgba(255,255,255,0.65)]" />

      <p className="body2-medium relative tracking-[-0.056rem] text-text-disable">{label}</p>
      <p
        className={cn(
          'headline2-bold relative line-clamp-2 tracking-[-0.06rem]',
          chatCardTitleColor[color],
        )}
      >
        {summary}
      </p>
    </article>
  );
};

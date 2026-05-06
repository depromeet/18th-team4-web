import {
  chatCardBackgroundColor,
  type ChatCardColor,
  GrainyOverlay,
  ReadumMarkIcon,
} from '@/components';
import { cn } from '@/lib';

export type SummarySection = {
  heading: string;
  body: string;
};

type Props = {
  sections: SummarySection[];
  color: ChatCardColor;
};

export const SummaryCard = (props: Props) => {
  const { sections, color } = props;

  return (
    <article
      className={cn(
        'relative rounded-[2.4rem] border border-border-white summary-card-shadow p-[2.4rem] overflow-hidden',
        chatCardBackgroundColor[color],
      )}
    >
      <GrainyOverlay />

      <header className="flex items-center gap-[0.4rem] text-gray-alpha-900">
        <ReadumMarkIcon className="w-[2.4rem] h-[0.9rem] text-gray-alpha-900" />
        <p className="body2-bold tracking-[-0.03em]">요약을 완성했어요!</p>
      </header>

      <hr className="border-t mt-[1.2rem] mb-8 border-gray-alpha-100" />

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <section key={section.heading}>
            <h3 className="body1-bold tracking-[-0.03em] text-text-default">{section.heading}</h3>
            <p className="body2-semibold tracking-[-0.03em] text-text-default whitespace-pre-line">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
};

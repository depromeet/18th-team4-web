import { ReadumMarkIcon } from '@/components';

export type SummarySection = {
  heading: string;
  body: string;
};

type Props = {
  sections: SummarySection[];
};

export const SummaryCard = (props: Props) => {
  const { sections } = props;

  return (
    <article className="relative rounded-[2.4rem] border border-border-white bg-summary-card-bg summary-card-shadow p-[2.4rem] overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id="summary-card-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="6" intercept="-2.5" />
              <feFuncG type="linear" slope="6" intercept="-2.5" />
              <feFuncB type="linear" slope="6" intercept="-2.5" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#summary-card-noise)" opacity="0.11" />
      </svg>

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

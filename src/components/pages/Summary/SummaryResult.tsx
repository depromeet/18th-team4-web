export type SummarySection = {
  heading: string;
  body: string;
};

type Props = {
  sections: SummarySection[];
};

export const SummaryResult = (props: Props) => {
  const { sections } = props;

  return (
    <section className="flex flex-col">
      <header className="px-[2.4rem] py-[0.8rem]">
        <h1 className="headline1-extrabold tracking-[-0.03em] text-text-default">
          요약을 완성했어요
        </h1>
      </header>

      <div className="mt-[2rem] flex flex-col gap-[2.4rem] px-[2.4rem] pb-[2.8rem]">
        {sections.map((section) => (
          <article key={section.heading} className="flex flex-col gap-[0.8rem]">
            <h2 className="body1-bold tracking-[-0.03em] text-text-default">{section.heading}</h2>
            <p className="body2-medium tracking-[-0.03em] text-text-default whitespace-pre-line">
              {section.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

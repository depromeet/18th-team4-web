type Props = {
  title: string;
  body: string;
};

export const SummaryResult = (props: Props) => {
  const { title, body } = props;

  return (
    <section className="flex flex-col gap-[1.2rem] px-[2.4rem] pt-[3.2rem] pb-[2.4rem]">
      <h1 className="headline1-extrabold tracking-[-0.03em] text-text-default">{title}</h1>
      <p className="body1-medium whitespace-pre-line tracking-[-0.04em] text-text-description">
        {body}
      </p>
    </section>
  );
};

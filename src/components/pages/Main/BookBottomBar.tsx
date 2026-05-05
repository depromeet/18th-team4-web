import { ChevronIcon, TextfieldChat } from '@/components';

type Props = {
  bookTitle: string;
};

export const BookBottomBar = (props: Props) => {
  const { bookTitle } = props;

  return (
    <div className="flex flex-col gap-[1.8rem] bg-background-primary-white px-[2.4rem] pt-[2.8rem] pb-[2.4rem] shadow-[0_0_2rem_rgba(23,28,27,0.1)]">
      <div className="flex items-center gap-[0.2rem]">
        <p className="headline2-extrabold tracking-[-0.06rem] text-text-default">
          {bookTitle}
        </p>
        <ChevronIcon className="size-8 rotate-180 fill-icon-primary" />
      </div>
      <TextfieldChat />
    </div>
  );
};

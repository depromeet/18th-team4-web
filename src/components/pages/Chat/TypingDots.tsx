import { cn } from '@/lib';

type Props = {
  dark?: boolean;
};

export const TypingDots = (props: Props) => {
  const { dark = false } = props;

  return (
    <div
      aria-hidden
      className="p-[1.2rem] flex justify-center items-center gap-[0.4rem] rounded-[30px] bg-gray-10 mt-[1rem]"
    >
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={cn(
            'w-[0.7rem] h-[0.7rem] rounded-full animate-typing-dot',
            dark ? 'bg-gray-300' : 'bg-icon-dot',
          )}
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </div>
  );
};

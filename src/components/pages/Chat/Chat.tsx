import { type VariantProps } from 'class-variance-authority';
import { ColorSymbolIcon } from '@/components';
import { CHAT_USER, ChatUser } from '@/constants';
import { cn } from '@/lib';
import { containerVariants } from './chatVariants';

type Props = VariantProps<typeof containerVariants> & {
  user?: ChatUser;
  message: string;
  isStreaming?: boolean;
  showIcon?: boolean;
};

export const Chat = (props: Props) => {
  const { user = CHAT_USER.ME, message, isStreaming = false, showIcon = false } = props;

  return (
    <div className={cn(containerVariants({ user }))}>
      <p className="body2-semibold whitespace-pre-wrap break-words text-text-default">
        {message}
        {isStreaming ? (
          <span
            aria-hidden
            className="animate-text-caret-blink ml-px inline-block h-[0.95em] w-px bg-current align-baseline motion-reduce:animate-none motion-reduce:opacity-85"
          />
        ) : null}
      </p>
      {showIcon ? (
        <span className="chat-symbol-soft-blink mt-[1.2rem] inline-flex shrink-0">
          <ColorSymbolIcon />
        </span>
      ) : null}
    </div>
  );
};

import { type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { Chatbot } from '@/assets';
import { CHAT_USER, ChatUser } from '@/constants';
import { cn } from '@/lib';
import { containerVariants } from './chatVariants';
import { TypingDots } from './TypingDots';

type Props = VariantProps<typeof containerVariants> & {
  user?: ChatUser;
  message: string;
  time?: string;
  isStreaming?: boolean;
  showIcon?: boolean;
};

export const Chat = (props: Props) => {
  const { user = CHAT_USER.ME, message, isStreaming = false, showIcon = false, tone, time } = props;
  const isMe = user === CHAT_USER.ME;

  const bubble = (
    <div className={cn(containerVariants({ user, tone }))}>
      {showIcon ? (
        <Image src={Chatbot} alt="chatbot" width={32} height={32} className="mb-[0.6rem]" />
      ) : null}
      {isStreaming && !message ? <TypingDots /> : null}
      <p className="body2-semibold whitespace-pre-wrap break-words text-text-default">{message}</p>
    </div>
  );

  if (isMe) {
    return (
      <div className="flex items-end gap-[0.6rem] self-end">
        {time && <span className="caption1-medium shrink-0 text-gray-alpha-200">{time}</span>}
        {bubble}
      </div>
    );
  }

  return bubble;
};

import { type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { type ReactNode } from 'react';
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

const renderBoldText = (text: string) => {
  const nodes: ReactNode[] = [];
  const boldPattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <strong key={`${match.index}-${match[1]}`} className="font-bold">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : text;
};

export const Chat = (props: Props) => {
  const { user = CHAT_USER.ME, message, isStreaming = false, showIcon = false, time } = props;
  const isMe = user === CHAT_USER.ME;

  const bubble = (
    <div className={cn(containerVariants({ user }))}>
      {showIcon ? (
        <Image src={Chatbot} alt="chatbot" width={32} height={32} className="mb-[0.6rem]" />
      ) : null}
      {isStreaming && !message ? (
        <div className="w-fit">
          <TypingDots />
        </div>
      ) : (
        <p className="body2-semibold whitespace-pre-wrap break-words tracking-[-0.03em] text-text-default">
          {renderBoldText(message)}
        </p>
      )}
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

'use client';

import { Chat } from '@/components';
import { CHAT_USER, type ChatMessage } from '@/constants';
import { formatChatTime } from '@/lib';

type Props = {
  messages: ChatMessage[];
  hasOlder: boolean;
  isFetchingOlder: boolean;
  onLoadOlder: () => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export const SummaryChatHistory = (props: Props) => {
  const { messages, hasOlder, isFetchingOlder, onLoadOlder, isLoading, isError, onRetry } = props;

  const lastAiIndex = messages.reduce(
    (last, chat, index) => (chat.user === CHAT_USER.AI ? index : last),
    -1,
  );

  return (
    <section className="flex flex-col gap-[2.8rem] px-[2.4rem] pt-[2rem] pb-[2.8rem]">
      {hasOlder ? (
        <button
          type="button"
          onClick={onLoadOlder}
          disabled={isFetchingOlder}
          className="body2-semibold self-center text-text-caption underline-offset-2 hover:underline disabled:opacity-60"
        >
          {isFetchingOlder ? '불러오는 중...' : '이전 대화 더 보기'}
        </button>
      ) : null}

      {isError && messages.length === 0 ? (
        <div className="flex flex-col items-center gap-[1.2rem] py-[2.4rem]">
          <p className="body2-medium text-text-caption text-center">대화를 불러오지 못했어요.</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="body2-semibold text-text-caption underline-offset-2 hover:underline"
            >
              다시 시도
            </button>
          ) : null}
        </div>
      ) : isLoading && messages.length === 0 ? (
        <p className="body2-medium text-text-caption text-center py-[2.4rem]">
          대화를 불러오는 중...
        </p>
      ) : messages.length === 0 ? (
        <p className="body2-medium text-text-caption text-center py-[2.4rem]">
          아직 나눈 대화가 없어요.
        </p>
      ) : (
        messages.map((chat, index) => (
          <Chat
            key={`${chat.id}-${index}`}
            user={chat.user}
            message={chat.message}
            time={
              chat.user === CHAT_USER.ME && chat.createdAt
                ? formatChatTime(chat.createdAt)
                : undefined
            }
            showIcon={index === lastAiIndex}
          />
        ))
      )}
    </section>
  );
};

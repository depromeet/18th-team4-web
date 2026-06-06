'use client';

import { Chat } from '@/components';
import { type ChatMessage } from '@/constants';

type Props = {
  messages: ChatMessage[];
  hasOlder: boolean;
  isFetchingOlder: boolean;
  onLoadOlder: () => void;
};

export const SummaryChatHistory = (props: Props) => {
  const { messages, hasOlder, isFetchingOlder, onLoadOlder } = props;

  return (
    <section className="flex flex-col gap-[2.4rem] px-[2.4rem] pt-[2rem] pb-[2.8rem]">
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

      {messages.length === 0 ? (
        <p className="body2-medium text-text-caption text-center py-[2.4rem]">
          아직 나눈 대화가 없어요.
        </p>
      ) : (
        messages.map((chat) => (
          <Chat key={chat.id} user={chat.user} message={chat.message} tone="soft" />
        ))
      )}
    </section>
  );
};

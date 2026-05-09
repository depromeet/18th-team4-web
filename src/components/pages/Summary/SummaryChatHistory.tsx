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
    <section className="relative z-10 bg-text-white shadow-[0_0_16px_0_rgba(0,0,0,0.08)] flex flex-col pt-[2rem] pb-[2.8rem]">
      <header className="px-[2.4rem] py-[0.8rem]">
        <h2 className="body1-bold tracking-[-0.03em] text-text-default">대화 기록</h2>
      </header>

      <hr className="mx-[2.4rem] border-t border-gray-alpha-50" />

      <div className="mt-[2.8rem] flex flex-col gap-[2.4rem] px-[2.4rem]">
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
      </div>
    </section>
  );
};

'use client';

import { useEffect, useRef } from 'react';
import { ChatCard, CHAT_CARD_COLOR, CHAT_CARD_STATUS, Header, HEADER_VARIANT } from '@/components';

export const RecordsBody = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div className="relative flex-1 flex flex-col bg-background-primary-base overflow-y-hidden">
      <Header variant={HEADER_VARIANT.HOME} className="absolute top-0 z-10" />
      <div className="flex-1" />
      <div ref={containerRef} className="relative flex flex-col overflow-y-auto py-[6.4rem] scrollbar-hide">
        <ChatCard
          color={CHAT_CARD_COLOR.MAGENTA}
          status={CHAT_CARD_STATUS.DEFAULT}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          className="mb-[-6.4rem]"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.MAGENTA}
          status={CHAT_CARD_STATUS.DEFAULT}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          className="mb-[-6.4rem]"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.YELLOW}
          status={CHAT_CARD_STATUS.DEFAULT}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          className="mb-[-6.4rem]"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.PURPLE}
          status={CHAT_CARD_STATUS.DEFAULT}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          className="mb-[-6.4rem]"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.GREEN}
          status={CHAT_CARD_STATUS.LOADING}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          className="mb-[-6.4rem]"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.TEAL}
          status={CHAT_CARD_STATUS.DEFAULT}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          bookmarked
          className="mb-[-6.4rem]"
        />
      </div>
    </div>
  );
};

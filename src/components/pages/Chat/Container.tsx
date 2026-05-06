'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Header, HEADER_VARIANT, TextfieldChat } from '@/components';
import { CHAT_BG_VARIANT, CHAT_USER, ChatMessage } from '@/constants';
import { useModal } from '@/hooks';
import { chatData } from '@/lib';
import { Chat } from './Chat';
import { Modal } from './Modal';

const Container = () => {
  const router = useRouter();
  const { isOpen, open, close } = useModal();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatMessage[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const canSummarize = chats.filter((chat) => chat.user === CHAT_USER.AI).length >= 2;

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const newUserMessage = {
      id: crypto.randomUUID(),
      user: CHAT_USER.ME,
      message: trimmedMessage,
    };

    const newAiMessage = chatData.map((msg) => ({
      id: crypto.randomUUID(),
      user: CHAT_USER.AI,
      message: msg,
    }));

    setChats((prev) => [...prev, newUserMessage, ...newAiMessage]);

    setMessage('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-gradient-chat pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex h-screen flex-col">
        <Header
          variant={HEADER_VARIANT.CHAT}
          summarizeActive={canSummarize}
          onBack={() => router.back()}
          onCta={open}
        />

        <main className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-[2.4rem] pb-48">
          <div className="flex flex-col gap-[2.8rem]">
            {chats.map((chat) => (
              <Chat key={chat.id} user={chat.user} message={chat.message} />
            ))}
            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="bg-gradient-footer absolute inset-x-0 bottom-0 z-20 rounded-t-[24px] border border-border-white/30 border-b-0 px-[2.4rem] py-8 backdrop-blur-md">
          <TextfieldChat
            bgVariant={CHAT_BG_VARIANT.WHITE}
            placeholder="이야기를 나눠보세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={handleSend}
          />
        </footer>
      </div>

      <Modal isOpen={isOpen} onCancel={close} onConfirm={open} />
    </div>
  );
};

export default Container;

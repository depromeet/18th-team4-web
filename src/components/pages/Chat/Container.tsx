'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header, HEADER_VARIANT, TextfieldChat } from '@/components';
import { Chat } from '@/components/pages/Chat/Chat';
import { CHAT_BG_VARIANT, CHAT_USER, ChatMessage } from '@/constants';

const Container = () => {
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatMessage[]>([]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setChats((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: CHAT_USER.ME,
        message: trimmedMessage,
      },
    ]);

    setMessage('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-gradient-chat pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header variant={HEADER_VARIANT.CHAT} onBack={() => router.back()} />

        <main className="flex flex-1 flex-col gap-[2rem] overflow-y-auto px-[2rem] py-[2.4rem]">
          {chats.map((chat) => (
            <Chat key={chat.id} user={chat.user} message={chat.message} />
          ))}
        </main>

        <footer className="bg-gradient-footer rounded-l-[24px] rounded-r-[24px] px-[2rem] py-[2.4rem]">
          <TextfieldChat
            bgVariant={CHAT_BG_VARIANT.WHITE}
            placeholder="이야기를 나눠보세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={handleSend}
          />
        </footer>
      </div>
    </div>
  );
};

export default Container;

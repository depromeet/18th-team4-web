'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header, HEADER_VARIANT, TextfieldChat } from '@/components';
import { Chat } from '@/components/pages/Chat/Chat';
import { CHAT_BG_VARIANT, CHAT_USER, ChatMessage } from '@/constants';
import { chatData } from '@/lib/mocks/chatData';

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

    setChats((prev) => [
      ...prev,
      ...chatData.map((msg, idx) => ({
        id: Date.now() + idx + 1,
        user: CHAT_USER.AI,
        message: msg,
      })),
    ]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-gradient-chat pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex h-screen flex-col">
        <Header variant={HEADER_VARIANT.CHAT} onBack={() => router.back()} />

        <main className="flex-1 overflow-y-auto px-[2.4rem] py-[2.4rem]">
          <div className="flex flex-col gap-[2.8rem]">
            {chats.map((chat) => (
              <Chat key={chat.id} user={chat.user} message={chat.message} />
            ))}
          </div>
        </main>

        <footer className="bg-gradient-footer rounded-t-[24px] px-[2.4rem] py-[2rem]">
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

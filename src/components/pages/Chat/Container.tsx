'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Header, HEADER_VARIANT, TextfieldChat } from '@/components';
import { CHAT_BG_VARIANT, CHAT_USER, type ChatMessage } from '@/constants';
import { useModal } from '@/hooks';
import { streamChatMessage, useCheckSummaryEligibility, useGetMessages } from '@/lib';
import { Chat } from './Chat';
import { Modal } from './Modal';

const ERROR_MESSAGES: Record<string, string> = {
  AI_QUOTA_EXHAUSTED: '오늘 대화 한도를 초과했어요. 내일 다시 시도해주세요.',
  AI_PROVIDER_ERROR: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_PROVIDER_TRANSIENT: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  AI_STREAM_INTERRUPTED: '응답 중 연결이 끊겼어요. 다시 시도해주세요.',
};

const Container = () => {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const { isOpen, open, close } = useModal();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [newChats, setNewChats] = useState<ChatMessage[]>([]);

  const { data: eligibilityData } = useCheckSummaryEligibility(sessionId);
  const canSummarize = eligibilityData?.eligible ?? false;

  const { data: messagesData } = useGetMessages(sessionId);

  const historyChats: ChatMessage[] = (messagesData?.pages ?? [])
    .flatMap((page) => page.messages)
    .reverse()
    .map((msg) => ({
      id: msg.id,
      user: msg.role === 'USER' ? CHAT_USER.ME : CHAT_USER.AI,
      message: msg.content,
    }));

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const allChats = [...historyChats, ...newChats];
  const lastAIIndex = allChats.reduce(
    (last, chat, i) => (chat.user === CHAT_USER.AI ? i : last),
    -1,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChats.length, streamingContent]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isStreaming) return;

    setMessage('');

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      user: CHAT_USER.ME,
      message: trimmedMessage,
    };
    setNewChats((prev) => [...prev, userMessage]);

    setIsStreaming(true);
    setStreamingContent('');
    let accumulated = '';

    try {
      await streamChatMessage(sessionId, trimmedMessage, {
        onToken: (delta) => {
          accumulated += delta;
          setStreamingContent(accumulated);
          return new Promise<void>((resolve) => setTimeout(resolve, 30));
        },
        onDone: (data) => {
          setIsStreaming(false);
          setStreamingContent('');
          setNewChats((prev) => [
            ...prev,
            {
              id: String(data.messageId),
              user: CHAT_USER.AI,
              message: accumulated,
            },
          ]);
        },
        onError: (data) => {
          setIsStreaming(false);
          setStreamingContent('');
          const errorMessage = ERROR_MESSAGES[data.code] ?? '오류가 발생했어요. 다시 시도해주세요.';
          setNewChats((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              user: CHAT_USER.AI,
              message: errorMessage,
            },
          ]);
        },
      });
    } catch {
      setIsStreaming(false);
      setStreamingContent('');
    }
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
            {allChats.map((chat, index) => (
              <Chat
                key={chat.id}
                user={chat.user}
                message={chat.message}
                showIcon={!isStreaming && index === lastAIIndex}
              />
            ))}
            {isStreaming && (
              <Chat user={CHAT_USER.AI} message={streamingContent} isStreaming showIcon />
            )}
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

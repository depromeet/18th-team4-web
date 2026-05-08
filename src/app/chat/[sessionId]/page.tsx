import { type Metadata } from 'next';
import { Suspense } from 'react';
import { ChatContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum: AI 대화하기',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

const ChatPage = () => {
  return (
    <Suspense>
      <ChatContainer />
    </Suspense>
  );
};

export default ChatPage;

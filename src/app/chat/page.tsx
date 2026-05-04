import { Metadata } from 'next';
import { ChatContainer } from '@/components';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Readum: AI 대화하기',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
}

export default function ChatPage() {
  return <ChatContainer />;
}

import { VariantProps } from 'class-variance-authority';
import { containerVariants } from '@/components/pages/Chat/chatVariants';
import { cn } from '@/lib';

// constant/textfield 폴더로 빼기
export const CHAT_USER = {
  ME: 'me',
  AI: 'ai',
} as const;

export type ChatUser = (typeof CHAT_USER)[keyof typeof CHAT_USER];

type Props = VariantProps<typeof containerVariants> & {
  user?: ChatUser;
  message: string;
};

const Chat = (props: Props) => {
  const { user = CHAT_USER.ME, message } = props;

  return (
    <div className={cn(containerVariants({ user }))}>
      <p className="text-text-default body2-semibold">{message}</p>
    </div>
  );
};

export default Chat;

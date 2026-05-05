import { VariantProps } from 'class-variance-authority';
import { CHAT_USER, ChatUser } from '@/constants';
import { cn } from '@/lib';
import { containerVariants } from './chatVariants';

type Props = VariantProps<typeof containerVariants> & {
  user?: ChatUser;
  message: string;
};

export const Chat = (props: Props) => {
  const { user = CHAT_USER.ME, message } = props;

  return (
    <div className={cn(containerVariants({ user }))}>
      <p className="text-text-default body2-semibold">{message}</p>
    </div>
  );
};

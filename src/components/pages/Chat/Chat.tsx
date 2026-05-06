import { VariantProps } from 'class-variance-authority';
import { ColorSymbolIcon } from '@/components';
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
      <p className="body2-semibold whitespace-pre-wrap break-words text-text-default">{message}</p>
      {user === CHAT_USER.AI ? <ColorSymbolIcon className="mt-[1.2rem]" /> : null}
    </div>
  );
};

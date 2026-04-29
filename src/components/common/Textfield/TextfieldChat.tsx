import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { SendIcon } from '@/components/common/Icon';
import {
  containerVariants,
  inputVariants,
  sendButtonVariants,
} from '@/components/common/Textfield/textfieldChatVariants';
import { CHAT_BG_VARIANT, CHAT_PLACEHOLDER, CHAT_STATUS } from '@/constants/textfieldChat';
import { cn } from '@/lib';
import { BaseInput } from './BaseInput';

type Props = Omit<React.ComponentProps<'input'>, 'disabled'> &
  VariantProps<typeof containerVariants> & {
    onSend?: () => void;
  };

export const TextfieldChat = (props: Props) => {
  const { status = CHAT_STATUS.DEFAULT, bgVariant = CHAT_BG_VARIANT.GRAY, onSend, ...rest } = props;

  const placeholder = CHAT_PLACEHOLDER[status ?? CHAT_STATUS.DEFAULT];
  const isDisabled = status === CHAT_STATUS.DISABLED || status === CHAT_STATUS.ERROR;

  return (
    <div className={cn(containerVariants({ bgVariant, status }))}>
      <BaseInput
        disabled={isDisabled}
        className={inputVariants({ status })}
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="submit"
        onClick={onSend}
        disabled={isDisabled}
        className={cn(sendButtonVariants({ status }))}
        aria-label="전송"
      >
        <SendIcon className="size-[3.6rem]" />
      </button>
    </div>
  );
};

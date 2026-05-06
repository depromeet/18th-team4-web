import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { BaseInput, containerVariants, inputVariants, sendButtonVariants } from '@/components';
import { SendIcon } from '@/components/common/Icon';
import { CHAT_BG_VARIANT, CHAT_PLACEHOLDER, CHAT_STATUS } from '@/constants';
import { cn } from '@/lib';

type Props = Omit<React.ComponentProps<'input'>, 'disabled'> &
  VariantProps<typeof containerVariants> & {
    onSend?: () => void;
  };

export const TextfieldChat = (props: Props) => {
  const { status = CHAT_STATUS.DEFAULT, bgVariant = CHAT_BG_VARIANT.GRAY, onSend, ...rest } = props;

  const placeholder = CHAT_PLACEHOLDER[status ?? CHAT_STATUS.DEFAULT];
  const isDisabled = status === CHAT_STATUS.DISABLED || status === CHAT_STATUS.ERROR;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      onSend?.();
    }
    rest.onKeyDown?.(e);
  };

  return (
    <div className={cn(containerVariants({ bgVariant, status }))}>
      <BaseInput
        disabled={isDisabled}
        className={cn(inputVariants({ status }))}
        placeholder={placeholder}
        {...rest}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
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

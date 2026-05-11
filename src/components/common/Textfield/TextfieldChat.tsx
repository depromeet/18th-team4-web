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
  const isDisabled =
    status === CHAT_STATUS.DISABLED ||
    status === CHAT_STATUS.ERROR ||
    status === CHAT_STATUS.LOADING;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && !isDisabled) {
      onSend?.();
    }
    rest.onKeyDown?.(e);
  };

  return (
    <div
      className={cn(containerVariants({ bgVariant, status }))}
      aria-busy={status === CHAT_STATUS.LOADING ? true : undefined}
    >
      <BaseInput
        disabled={isDisabled}
        className={cn(inputVariants({ status }))}
        placeholder={placeholder}
        {...rest}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={() => {
          if (!isDisabled) {
            onSend?.();
          }
        }}
        disabled={isDisabled}
        className={cn(sendButtonVariants({ status }))}
        aria-label={status === CHAT_STATUS.LOADING ? '이동 중' : '전송'}
      >
        {status === CHAT_STATUS.LOADING ? (
          <span
            aria-hidden
            className={cn(
              'size-8 shrink-0 rounded-full border-2 border-solid border-text-disable/40',
              'border-t-text-default/55 motion-reduce:animate-none animate-spin',
            )}
          />
        ) : (
          <SendIcon className="size-[3.6rem]" />
        )}
      </button>
    </div>
  );
};

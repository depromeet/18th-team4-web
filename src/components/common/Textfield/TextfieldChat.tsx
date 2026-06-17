import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import {
  containerVariants,
  inputVariants,
  sendButtonVariants,
  sendIconVariants,
} from '@/components';
import { SendIcon } from '@/components/common/Icon';
import { CHAT_BG_VARIANT, CHAT_PLACEHOLDER, CHAT_STATUS } from '@/constants';
import { cn } from '@/lib';

type Props = Omit<React.ComponentProps<'textarea'>, 'disabled'> &
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

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [rest.value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && !isDisabled) {
      e.preventDefault();
      onSend?.();
    }
    rest.onKeyDown?.(e);
  };

  return (
    <div
      className={cn(containerVariants({ bgVariant, status }))}
      aria-busy={status === CHAT_STATUS.LOADING ? true : undefined}
    >
      <textarea
        ref={textareaRef}
        disabled={isDisabled}
        rows={1}
        className={cn(
          'w-full min-w-0 resize-none overflow-y-auto outline-none disabled:cursor-not-allowed',
          inputVariants({ status }),
        )}
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
          <SendIcon className={cn('size-[3.6rem]', sendIconVariants({ status }))} />
        )}
      </button>
    </div>
  );
};

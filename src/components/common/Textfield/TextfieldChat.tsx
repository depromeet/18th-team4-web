import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { SendIcon } from '@/components/common/Icon';
import { cn } from '@/lib';
import { BaseInput } from './BaseInput';

const containerVariants = cva(
  'flex items-center justify-center gap-[2rem] pl-[2.4rem] pr-[1.6rem] py-[2.2rem] rounded-[2.4rem] w-full',
  {
    variants: {
      bgVariant: {
        gray: 'bg-background-primary-base',
        white: 'bg-background-primary-white shadow-[0px_0px_32px_rgba(0,0,0,0.08)]',
      },
      status: {
        default: '',
        disabled: '',
        error: 'border border-negative',
      },
    },
    defaultVariants: {
      bgVariant: 'gray',
      status: 'default',
    },
  },
);

const inputVariants = cva('body1-medium placeholder:text-text-caption placeholder:body1-medium', {
  variants: {
    status: {
      default: 'text-text-default',
      disabled: 'placeholder:text-text-disable',
      error: 'text-negative placeholder:text-negative',
    },
  },
  defaultVariants: { status: 'default' },
});

const sendButtonVariants = cva('', {
  variants: {
    status: {
      default: 'text-text-default',
      disabled: 'text-icon-disabled cursor-not-allowed',
      error: 'text-icon-disabled',
    },
  },
  defaultVariants: { status: 'default' },
});

type Props = Omit<React.ComponentProps<'input'>, 'disabled'> &
  VariantProps<typeof containerVariants> & {
    onSend: () => void;
  };

export const TextfieldChat = (props: Props) => {
  const { status = 'default', bgVariant = 'gray', onSend, ...rest } = props;
  const DEFAULT_PLACEHOLDER = '오늘은 어떤 얘기를 해볼까요?';
  const DISABLED_PLACEHOLDER = '연결을 확인해주세요';
  const ERROR_PLACEHOLDER = '잘못된 입력';

  const placeholder =
    status === 'disabled'
      ? DISABLED_PLACEHOLDER
      : status === 'error'
        ? ERROR_PLACEHOLDER
        : DEFAULT_PLACEHOLDER;

  return (
    <div className={cn(containerVariants({ bgVariant, status }))}>
      <BaseInput
        disabled={status === 'disabled' || status === 'error'}
        className={inputVariants({ status })}
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="submit"
        onClick={onSend}
        disabled={status === 'disabled' || status === 'error'}
        className={cn(sendButtonVariants({ status }))}
        aria-label="전송"
      >
        <SendIcon className="size-[3.6rem]" />
      </button>
    </div>
  );
};

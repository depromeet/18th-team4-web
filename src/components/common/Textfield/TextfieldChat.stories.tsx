import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { TextfieldChat } from './TextfieldChat';

const meta = {
  title: 'Common/Textfield/TextfieldChat',
  component: TextfieldChat,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[32.7rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    status: {
      control: 'select',
      options: ['default', 'disabled', 'error'],
      description: 'default: 기본 | disabled: 비활성 | error: 오류',
    },
    bgVariant: {
      control: 'select',
      options: ['gray', 'white'],
      description: 'gray: 회색 배경 | white: 흰색 배경 + 그림자',
    },
    placeholder: { control: 'text' },
  },
  args: { onSend: fn() },
} satisfies Meta<typeof TextfieldChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (default)',
  args: {
    status: 'default',
    bgVariant: 'gray',
    placeholder: '오늘은 어떤 얘기를 해볼까요?',
  },
};

export const Writing: Story = {
  name: '입력 중',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextfieldChat
        {...args}
        status={'default'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    bgVariant: 'gray',
    placeholder: '오늘은 어떤 얘기를 해볼까요?',
  },
};

export const Done: Story = {
  name: '입력 완료',
  args: {
    status: 'default',
    bgVariant: 'gray',
    defaultValue: '입력완료',
  },
};

export const Disabled: Story = {
  name: 'disabled (연결을 확인해주세요)',
  args: {
    status: 'disabled',
    bgVariant: 'gray',
    placeholder: '연결을 확인해주세요',
  },
};

export const Error: Story = {
  name: 'error (잘못된 연결)',
  args: {
    status: 'error',
    bgVariant: 'gray',
    placeholder: '잘못된 연결',
  },
};

export const WhiteBackground: Story = {
  name: '흰색 배경',
  args: {
    status: 'default',
    bgVariant: 'white',
    placeholder: '오늘은 어떤 얘기를 해볼까요?',
  },
};

export const AllStates: Story = {
  name: '전체 상태 비교',
  render: () => (
    <div className="flex flex-col gap-[1.6rem] w-[32.7rem]">
      <p className="caption1-medium text-text-caption">gray 배경</p>
      <TextfieldChat status="default" bgVariant="gray" placeholder="오늘은 어떤 얘기를 해볼까요?" />
      <TextfieldChat status="default" bgVariant="gray" defaultValue="입력완료" />
      <TextfieldChat status="disabled" bgVariant="gray" placeholder="연결을 확인해주세요" />
      <TextfieldChat status="error" bgVariant="gray" placeholder="잘못된 연결" />
      <p className="caption1-medium text-text-caption mt-[0.8rem]">white 배경</p>
      <TextfieldChat
        status="default"
        bgVariant="white"
        placeholder="오늘은 어떤 얘기를 해볼까요?"
      />
      <TextfieldChat status="default" bgVariant="white" defaultValue="입력완료" />
      <TextfieldChat status="disabled" bgVariant="white" placeholder="연결을 확인해주세요" />
      <TextfieldChat status="error" bgVariant="white" placeholder="잘못된 연결" />
    </div>
  ),
};

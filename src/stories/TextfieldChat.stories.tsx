import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { TextfieldChat } from '@/components/common/Textfield/TextfieldChat';
import { CHAT_BG_VARIANT, CHAT_PLACEHOLDER, CHAT_STATUS } from '@/constants/textfieldChat';

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
      options: Object.values(CHAT_STATUS),
      description: 'default: 기본 | disabled: 비활성 | error: 오류',
    },
    bgVariant: {
      control: 'select',
      options: Object.values(CHAT_BG_VARIANT),
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
    status: CHAT_STATUS.DEFAULT,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT],
  },
};

export const Writing: Story = {
  name: '입력 중',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextfieldChat
        {...args}
        status={CHAT_STATUS.DEFAULT}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT],
  },
};

export const Done: Story = {
  name: '입력 완료',
  args: {
    status: CHAT_STATUS.DEFAULT,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    defaultValue: '입력완료',
  },
};

export const Disabled: Story = {
  name: 'disabled (연결을 확인해주세요)',
  args: {
    status: CHAT_STATUS.DISABLED,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DISABLED],
  },
};

export const Error: Story = {
  name: 'error (잘못된 연결)',
  args: {
    status: CHAT_STATUS.ERROR,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.ERROR],
  },
};

export const WhiteBackground: Story = {
  name: '흰색 배경',
  args: {
    status: CHAT_STATUS.DEFAULT,
    bgVariant: CHAT_BG_VARIANT.WHITE,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT],
  },
};

export const AllStates: Story = {
  name: '전체 상태 비교',
  render: () => (
    <div className="flex gap-[1.6rem] w-[70rem]">
      <div className="flex flex-col gap-[1.6rem] w-[32.7rem]">
        <p className="caption1-medium text-text-caption">gray 배경</p>
        <TextfieldChat
          status={CHAT_STATUS.DEFAULT}
          bgVariant={CHAT_BG_VARIANT.GRAY}
          placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]}
        />
        <TextfieldChat
          status={CHAT_STATUS.DEFAULT}
          bgVariant={CHAT_BG_VARIANT.GRAY}
          defaultValue="입력완료"
        />
        <TextfieldChat
          status={CHAT_STATUS.DISABLED}
          bgVariant={CHAT_BG_VARIANT.GRAY}
          placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DISABLED]}
        />
        <TextfieldChat
          status={CHAT_STATUS.ERROR}
          bgVariant={CHAT_BG_VARIANT.GRAY}
          placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.ERROR]}
        />
      </div>
      <div className="flex flex-col gap-[1.6rem] w-[32.7rem]">
        <p className="caption1-medium text-text-caption mt-[0.8rem]">white 배경</p>
        <TextfieldChat
          status={CHAT_STATUS.DEFAULT}
          bgVariant={CHAT_BG_VARIANT.WHITE}
          placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]}
        />
        <TextfieldChat
          status={CHAT_STATUS.DEFAULT}
          bgVariant={CHAT_BG_VARIANT.WHITE}
          defaultValue="입력완료"
        />
        <TextfieldChat
          status={CHAT_STATUS.DISABLED}
          bgVariant={CHAT_BG_VARIANT.WHITE}
          placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DISABLED]}
        />
        <TextfieldChat
          status={CHAT_STATUS.ERROR}
          bgVariant={CHAT_BG_VARIANT.WHITE}
          placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.ERROR]}
        />
      </div>
    </div>
  ),
};

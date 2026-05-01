import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chat, CHAT_USER } from './Chat';

const meta = {
  title: 'Components/Chat',
  component: Chat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'radio',
      options: [CHAT_USER.ME, CHAT_USER.AI],
    },
    message: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Me: Story = {
  args: {
    user: CHAT_USER.ME,
    message: '오늘 읽은 책에서 인상 깊었던 부분을 알려줄게요.',
  },
};

export const Ai: Story = {
  args: {
    user: CHAT_USER.AI,
    message: '어떤 내용이 가장 인상 깊으셨나요?',
  },
};

export const LongMessage: Story = {
  args: {
    user: CHAT_USER.ME,
    message:
      '이 책은 정말 흥미로운 내용이 많았는데, 특히 3장에서 다룬 주제가 오늘 제 상황과 많이 닮아있어서 깊게 공감됐어요.',
  },
};

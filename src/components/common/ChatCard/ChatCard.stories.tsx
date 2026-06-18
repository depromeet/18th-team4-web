import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { ChatCard } from './ChatCard';

const meta = {
  title: 'Common/ChatCard',
  component: ChatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[37.5rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    color: {
      control: 'select',
      options: ['teal', 'magenta', 'yellow', 'sky', 'green', 'purple', 'blue'],
      description: '카드 색상',
    },
    status: {
      control: 'select',
      options: ['default', 'loading', 'error'],
      description: '카드 상태',
    },
  },
  args: {
    color: 'teal',
    status: 'default',
    date: '25.10.10',
    summary: '대화한 내용 간단 요약 어쩌구 저쩌구',
  },
} satisfies Meta<typeof ChatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    status: 'loading',
  },
};

export const ErrorCard: Story = {
  name: 'Error',
  args: {
    status: 'error',
  },
};

export const ColorTeal: Story = {
  name: 'Color / Teal',
  args: { color: 'teal' },
};

export const ColorMagenta: Story = {
  name: 'Color / Magenta',
  args: { color: 'magenta' },
};

export const ColorYellow: Story = {
  name: 'Color / Yellow',
  args: { color: 'yellow' },
};

export const ColorSky: Story = {
  name: 'Color / Sky',
  args: { color: 'sky' },
};

export const ColorGreen: Story = {
  name: 'Color / Green',
  args: { color: 'green' },
};

export const ColorPurple: Story = {
  name: 'Color / Purple',
  args: { color: 'purple' },
};

export const ColorBlue: Story = {
  name: 'Color / Blue',
  args: { color: 'blue' },
};

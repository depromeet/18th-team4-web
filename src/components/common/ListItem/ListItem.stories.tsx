import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ListItem } from './ListItem';

const meta = {
  title: 'common/ListItem',
  component: ListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    imageSrc: 'https://placehold.co/50x73',
    imageAlt: '해리포터와 마법사의 돌 1 표지',
    title: '해리포터와 마법사의 돌 1',
    year: 2024,
    publisher: '문학수첩',
    onClick: fn(),
    className: 'border-2 border-dashed border-gray-alpha-100',
  },
  decorators: [
    (Story) => (
      <ul className="w-142">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: false,
    publisher: '문학수첩',
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    imageSrc: 'https://placehold.co/50x73',
  },
};

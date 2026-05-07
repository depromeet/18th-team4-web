import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ListItem } from '@/components';
import { BottomSheet } from './BottomSheet';

const DEMO_BOOKS = [
  { title: '해리포터와 마법사의 돌 1', selected: true },
  { title: '해리포터와 마법사의 돌 2', selected: false },
  { title: '해리포터와 비밀의 방', selected: false },
  { title: '해리포터와 아즈카반의 죄수', selected: false },
];

const BookList = () => (
  <ul className="flex flex-col px-4 pb-[2.4rem]">
    {DEMO_BOOKS.map(({ title, selected }) => (
      <ListItem
        key={title}
        imageSrc="https://placehold.co/50x73"
        imageAlt={`${title} 표지`}
        title={title}
        year={2024}
        publisher="문학수첩"
        selected={selected}
      />
    ))}
  </ul>
);

const meta = {
  title: 'Common/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    open: false,
    children: null,
    onClose: fn(),
    onMaxHeightTransitionEnd: fn(),
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => (
    <div className="relative h-screen">
      <BottomSheet {...args} open>
        <BookList />
      </BottomSheet>
    </div>
  ),
};

const InteractiveStory = (args: React.ComponentProps<typeof BottomSheet>) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        type="button"
        className="rounded-2xl bg-gray-900 px-[1.6rem] py-[0.8rem] text-white"
        onClick={() => setOpen(true)}
      >
        바텀시트 열기
      </button>
      <BottomSheet {...args} open={open} onClose={() => setOpen(false)}>
        <BookList />
      </BottomSheet>
    </div>
  );
};

export const Interactive: Story = {
  render: (args) => <InteractiveStory {...args} />,
};

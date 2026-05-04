import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { TextfieldSearch } from '@/components';

const meta = {
  title: 'Common/Textfield/TextfieldSearch',
  component: TextfieldSearch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[32.7rem]">
        <Story />
      </div>
    ),
  ],
  args: { onSearch: fn() },
} satisfies Meta<typeof TextfieldSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (빈 상태)',
};

export const Writing: Story = {
  name: '입력 중',
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextfieldSearch {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

export const Filled: Story = {
  name: '입력 완료',
  args: {
    value: '입력 완료',
  },
};

export const AllStates: Story = {
  name: '전체 상태 비교',
  render: () => (
    <div className="flex flex-col gap-[3.2rem] w-[32.7rem]">
      <div>
        <p className="caption1-medium text-text-caption mb-[0.8rem]">빈 상태</p>
        <TextfieldSearch />
      </div>
      <div>
        <p className="caption1-medium text-text-caption mb-[0.8rem]">입력 완료</p>
        <TextfieldSearch value="입력 완료" />
      </div>
    </div>
  ),
};

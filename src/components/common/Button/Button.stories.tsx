import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          minWidth: '80rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['black', 'gray', 'red', 'lightgray'],
      description: '버튼 색상 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: '버튼 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
  },
  args: {
    children: '버튼',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Black: Story = {
  args: {
    variant: 'black',
    size: 'md',
  },
};

export const Gray: Story = {
  args: {
    variant: 'gray',
    size: 'md',
  },
};

export const Red: Story = {
  args: {
    variant: 'red',
    size: 'md',
  },
};

export const LightGray: Story = {
  args: {
    variant: 'lightgray',
    size: 'md',
  },
};

export const SizeSmall: Story = {
  name: 'Size / Small',
  args: {
    variant: 'black',
    size: 'sm',
  },
};

export const SizeMedium: Story = {
  name: 'Size / Medium',
  args: {
    variant: 'black',
    size: 'md',
  },
};

export const SizeLarge: Story = {
  name: 'Size / Large',
  args: {
    variant: 'black',
    size: 'lg',
  },
};

export const SizeFull: Story = {
  name: 'Size / Full',
  args: {
    variant: 'black',
    size: 'full',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'black',
    size: 'md',
    disabled: true,
  },
};

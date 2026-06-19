import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { Loading } from './index';

const meta = {
  title: 'Common/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-[20rem] w-[37.5rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

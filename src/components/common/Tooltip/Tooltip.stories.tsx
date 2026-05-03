import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { Tooltip } from '@/components';

const meta = {
  title: 'Common/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    content: '이제 대화를 요약할 수 있어요',
  },
  argTypes: {
    arrowAlignment: {
      control: 'radio',
      options: ['left', 'middle', 'right'],
    },
    arrowSide: {
      control: 'radio',
      options: ['top', 'bottom'],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    content: '아직 대화를 요약할 수 없어요. 대화를 더 진행한 후 요약을 진행할 수 있어요',
  },
};

export const Coachmark: Story = {
  render: () => (
    <div className="relative inline-flex">
      <button
        aria-describedby="coachmark-tooltip"
        className="body2-bold rounded-[0.625rem] bg-primary-base px-3 py-[0.63rem] text-gray-900"
        type="button"
      >
        대화 요약
      </button>
      <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
        <Tooltip
          arrowAlignment="middle"
          content="이제 대화를 요약할 수 있어요"
          id="coachmark-tooltip"
        />
      </div>
    </div>
  ),
};

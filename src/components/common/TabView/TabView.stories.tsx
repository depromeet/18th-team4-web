import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { TabView } from '@/components';

const meta = {
  title: 'Common/TabView',
  component: TabView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabView>;

export default meta;

type Story = StoryObj<typeof meta>;

const Panel = (props: { children: string }) => (
  <div className="body1-medium px-[2.4rem] py-[3.2rem] text-text-default">{props.children}</div>
);

export const Default: Story = {
  args: {
    defaultValue: 'registered',
    tabs: [
      {
        value: 'registered',
        label: '등록된 책',
        count: 13,
        content: <Panel>등록된 책 콘텐츠</Panel>,
      },
      { value: 'records', label: '감상 기록', count: 24, content: <Panel>감상 기록 콘텐츠</Panel> },
    ],
  },
};

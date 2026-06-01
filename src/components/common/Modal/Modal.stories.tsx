import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MODAL_TYPE } from '@/constants';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Chat/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    modalType: { control: 'select', options: Object.keys(MODAL_TYPE) },
    onCancel: { action: 'cancelled' },
    onConfirm: { action: 'confirmed' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    modalType: 'DELETE',
    onCancel: () => {},
    onConfirm: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    modalType: 'DELETE',
    onCancel: () => {},
    onConfirm: () => {},
  },
};

const InteractiveTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        className="px-6 py-3 bg-black text-white rounded-[1.6rem] text-sm font-medium"
        onClick={() => setIsOpen(true)}
      >
        대화 마무리
      </button>
      <Modal
        isOpen={isOpen}
        modalType="DELETE"
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          alert('확인!');
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    modalType: 'DELETE',
    onCancel: () => {},
    onConfirm: () => {},
  },
  render: () => <InteractiveTemplate />,
};

import { create } from 'zustand';

type PendingChatState = {
  message: string;
  consume: () => string;
  set: (message: string) => void;
};

export const usePendingChatStore = create<PendingChatState>()((setState, getState) => ({
  message: '',
  consume: () => {
    const { message } = getState();
    setState({ message: '' });
    return message;
  },
  set: (message) => setState({ message }),
}));

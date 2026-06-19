import { create } from 'zustand';

type PendingChatState = {
  message: string;
  userBookId: number | null;
  sessionId: string | null;
  consume: () => string;
  setUserBookId: (userBookId: number) => void;
  clearUserBookId: () => void;
  setSessionId: (sessionId: string) => void;
  clearSessionId: () => void;
  set: (message: string) => void;
};

export const usePendingChatStore = create<PendingChatState>()((setState, getState) => ({
  message: '',
  userBookId: null,
  sessionId: null,
  consume: () => {
    const { message } = getState();
    setState({ message: '' });
    return message;
  },
  setUserBookId: (userBookId) => setState({ userBookId, sessionId: null }),
  clearUserBookId: () => setState({ userBookId: null }),
  setSessionId: (sessionId) => setState({ sessionId, userBookId: null }),
  clearSessionId: () => setState({ sessionId: null }),
  set: (message) => setState({ message }),
}));

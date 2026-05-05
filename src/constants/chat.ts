export const CHAT_USER = {
  ME: 'me',
  AI: 'ai',
} as const;

export type ChatUser = (typeof CHAT_USER)[keyof typeof CHAT_USER];

export type ChatMessage = {
  id: number;
  user: (typeof CHAT_USER)[keyof typeof CHAT_USER];
  message: string;
};

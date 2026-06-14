export const CHAT_STATUS = {
  DEFAULT: 'default',
  DISABLED: 'disabled',
  ERROR: 'error',
  LOADING: 'loading',
} as const;

export type chatStatus = (typeof CHAT_STATUS)[keyof typeof CHAT_STATUS];

export const CHAT_BG_VARIANT = {
  GRAY: 'gray',
  WHITE: 'white',
} as const;

export type chatBgVariant = (typeof CHAT_BG_VARIANT)[keyof typeof CHAT_BG_VARIANT];

export const CHAT_PLACEHOLDER = {
  [CHAT_STATUS.DEFAULT]: '오늘은 어떤 얘기를 해볼까요?',
  [CHAT_STATUS.DISABLED]: '오늘은 어떤 얘기를 해볼까요?',
  [CHAT_STATUS.ERROR]: '잘못된 입력',
  [CHAT_STATUS.LOADING]: '채팅방으로 이동 중이에요…',
} as const satisfies Record<chatStatus, string>;

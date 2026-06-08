export const PATH_NAME = {
  main: () => '/',

  chat: {
    list: () => '/chat',
    detail: (sessionId: string) => `/chat/${sessionId}`,
  },

  register: {
    list: () => '/register',
    complete: () => '/register/complete',
  },

  summary: {
    detail: (summaryId: string, tab?: string) =>
      tab ? `/summary/${summaryId}?tab=${tab}` : `/summary/${summaryId}`,
  },

  mypage: () => '/mypage',
} as const;

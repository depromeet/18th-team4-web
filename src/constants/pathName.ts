export const PATH_NAME = {
  main: () => '/',

  chat: {
    detail: (sessionId: string) => `/chat/${sessionId}`,
  },

  register: {
    list: () => '/register',
    complete: () => '/register/complete',
  },

  summary: {
    detail: (summaryId: string) => `/summary/${summaryId}`,
  },
} as const;

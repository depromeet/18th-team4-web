export const PATH_NAME = {
  main: () => '/',

  chat: () => '/chat',

  register: {
    list: () => '/register',
    complete: () => '/register/complete',
  },

  summary: {
    detail: (summaryId: string) => `/summary/${summaryId}`,
    loading: () => '/summary/loading',
    error: () => '/summary/error',
  },
} as const;

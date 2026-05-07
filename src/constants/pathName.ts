export const PATH_NAME = {
  main: () => '/',

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

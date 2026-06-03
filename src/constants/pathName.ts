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
    detail: (summaryId: string) => `/summary/${summaryId}`,
  },

  mypage: {
    main: () => '/mypage',
    list: (tab: string) => `/mypage/list?tab=${tab}`,
  },

  book: {
    detail: (bookId: string) => `/book/${bookId}`,
  },
} as const;

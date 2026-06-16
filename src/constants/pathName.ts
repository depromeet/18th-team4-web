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
    detail: (summaryId: string, tab?: string, source?: 'session') => {
      const params = new URLSearchParams();
      if (source) params.set('source', source);
      if (tab) params.set('tab', tab);
      const query = params.toString();

      return query ? `/summary/${summaryId}?${query}` : `/summary/${summaryId}`;
    },
    session: (sessionId: string, tab?: string, requestDraft = false) => {
      const params = new URLSearchParams({ source: 'session' });
      if (requestDraft) params.set('draft', 'true');
      if (tab) params.set('tab', tab);

      return `/summary/${sessionId}?${params.toString()}`;
    },
    edit: (summaryId: string, source?: 'session') =>
      source ? `/summary/${summaryId}/edit?source=${source}` : `/summary/${summaryId}/edit`,
  },

  mypage: {
    main: (tab?: string) => (tab ? `/mypage?tab=${tab}` : '/mypage'),
    list: (tab: string) => `/mypage/list?tab=${tab}`,
  },

  book: {
    detail: (bookId: string) => `/book/${bookId}`,
  },
} as const;

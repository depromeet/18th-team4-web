export const QUERY_KEY = {
  /*
   * 내 책장
   */
  userBooks: {
    all: () => ['userBooks'] as const,
    list: (size?: number) => ['userBooks', 'list', size] as const,
  },

  /*
   * EXAMPLE
   * 배달 권역
   */
  deliveryZone: {
    all: ['deliveryZone'],
    list: ['deliveryZone', 'list'],
  },

  /*
   * EXAMPLE
   * 배달
   */
  delivery: {
    all: ['delivery'],
    default: ['delivery', 'default'],
    list: ['delivery', 'list'],
    updateDefault: ['delivery', 'updateDefault'],
  },

  /*
   * AI 채팅
   */
  aiChat: {
    sessions: (userBookId: number) => ['aiChat', 'sessions', userBookId] as const,
    messages: (sessionId: string) => ['aiChat', 'messages', sessionId] as const,
    summaryEligibility: (sessionId: string) => ['aiChat', 'summaryEligibility', sessionId] as const,
    summary: (sessionId: string) => ['aiChat', 'summary', sessionId] as const,
  },

  /*
   * 감상 기록
   */
  summaries: {
    list: (size?: number) => ['summaries', 'list', size] as const,
  },

  /*
   * 사용자
   */
  users: {
    profile: () => ['users', 'profile'] as const,
  },
} as const;

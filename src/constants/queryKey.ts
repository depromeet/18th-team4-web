export const QUERY_KEY = {
  /*
   * 내 책장
   */
  userBooks: {
    list: () => ['userBooks', 'list'] as const,
  },

  /*
   * AI 채팅 세션
   */
  aiChat: {
    sessions: (userBookId: number) => ['aiChat', 'sessions', userBookId] as const,
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
} as const;

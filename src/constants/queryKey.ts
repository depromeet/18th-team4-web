export const QUERY_KEY = {
  /*
   * AI 채팅
   */
  aiChat: {
    sessions: (userBookId: number) => ['aiChat', 'sessions', userBookId] as const,
    messages: (sessionId: string) => ['aiChat', 'messages', sessionId],
    summaryEligibility: (sessionId: string) => ['aiChat', 'summaryEligibility', sessionId],
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

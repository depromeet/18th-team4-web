export const QUERY_KEY = {
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
    summaryEligibility: (sessionId: string) => ['aiChat', 'summaryEligibility', sessionId],
  },
} as const;

export const ENDPOINTS = {
  /*
   * 내 책장 - 사용자가 등록한 도서(책장) 관리
   */
  USER_BOOKS: {
    // 내 책장 도서 추가
    add: () => '/user-books',
  },

  /*
   * 도서 검색 - 외부 도서 검색 (알라딘 API 기반)
   */
  BOOKS: {
    // 키워드 도서 검색
    search: () => '/books',
  },

  /*
   * 사용자 세션 - 사용자 세션 발급 / 조회 / 온보딩 완료 처리
   */
  USERS: {
    // 현재 세션 정보 조회
    me: () => '/users/me',

    // 사용자 세션 생성
    create: () => '/users/sessions',

    // 온보딩 완료 처리
    onboarding: () => '/users/me/onboarding',
  },

  /*
   * 인증 - Access Token 재발급 및 로그아웃
   */
  AUTH: {
    // Access Token 재발급
    refresh: () => '/auth/refresh',

    // 로그아웃
    logout: () => '/auth/logout',
  },

  /*
   * AI 채팅 - AI와 책 한 권에 대해 대화하는 채팅 세션 및 메시지 관리
   */
  AI_CHAT: {
    // AI 채팅 세션 생성
    createSession: () => '/ai-chat/sessions',

    // 세션의 메시지 이력 조회 (페이지네이션)
    getMessages: (sessionId: string) => `/ai-chat/sessions/${sessionId}/messages`,

    // 메시지 전송 (SSE 스트리밍 응답)
    sendMessage: (sessionId: string) => `/ai-chat/sessions/${sessionId}/messages`,

    // 감상문 초안 생성 가능 여부 조회
    checkSummaryEligibility: (sessionId: string) =>
      `/ai-chat/sessions/${sessionId}/summary-draft/eligibility`,

    // 감상문 초안 생성
    createSummaryDraft: (sessionId: string) => `/ai-chat/sessions/${sessionId}/summary-draft`,

    // 감상문 조회
    getSummary: (sessionId: string) => `/ai-chat/sessions/${sessionId}/summary`,
  },

  /*
   * 예시 (참고용) - 신규 기능 작성 시 구조 참조용 템플릿 컨트롤러
   */
  EXAMPLES: {
    // 예시 목록 조회
    list: () => '/examples',

    // 예시 단건 조회
    detail: (id: string) => `/examples/${id}`,

    // 예시 생성
    create: () => '/examples',
  },
} as const;

export const ENDPOINTS = {
  /*
   * EXAMPLE
   * 사용자 - 논문 아카이브
   */
  PAPER: {
    // 논문 아카이브 목록 조회
    archieve: () => '/paper-archives',

    // 논문 아카이브 상세 조회
    detail: (id: number) => `/paper-archives/${id}`,
  },
} as const;

export const MYPAGE_TAB = {
  REGISTERED: 'registered',
  RECORDS: 'records',
} as const;

export type MypageTab = (typeof MYPAGE_TAB)[keyof typeof MYPAGE_TAB];

/** 탭 미리보기에서 노출할 개수 (더 보기 클릭 시 전체 목록 페이지로 이동). */
export const PREVIEW_COUNT = 4;

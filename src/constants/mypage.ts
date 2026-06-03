export const MYPAGE_TAB = {
  REGISTERED: 'registered',
  RECORDS: 'records',
} as const;

export type MypageTab = (typeof MYPAGE_TAB)[keyof typeof MYPAGE_TAB];

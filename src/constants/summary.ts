export const SUMMARY_TAB = {
  SUMMARY: 'summary',
  CHAT: 'chat',
} as const;

export type SummaryTab = (typeof SUMMARY_TAB)[keyof typeof SUMMARY_TAB];

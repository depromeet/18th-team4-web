'use server';

import { completeOnboarding } from '@/lib/api/services/users';

/* 온보딩 완료 처리 서버 액션 */
export const completeOnboardingAction = async () => {
  await completeOnboarding();
};

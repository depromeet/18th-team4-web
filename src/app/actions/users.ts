'use server';

import { revalidatePath } from 'next/cache';
import { completeOnboarding } from '@/lib';

/* 온보딩 완료 처리 서버 액션 */
export const completeOnboardingAction = async () => {
  await completeOnboarding();
  revalidatePath('/');
};

'use server';

import { revalidatePath } from 'next/cache';
import { completeOnboarding } from '@/lib';

type ActionResult = { success: true } | { success: false; message: string };

/* 온보딩 완료 처리 서버 액션 */
export const completeOnboardingAction = async (): Promise<ActionResult> => {
  try {
    await completeOnboarding();
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('[action] completeOnboarding 실패:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { completeOnboarding, HttpError } from '@/lib';

type ActionResult = { success: true } | { success: false; message: string };

const SESSION_COOKIE = 'user_session';

/* 세션 재발급 */
const issueGuestSession = async () => {
  const response = await fetch(`${process.env.API_PROXY_TARGET}/api/v1/users/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`세션 발급 실패: ${response.status}`);
  }

  const userSessionValue = response.headers.get('set-cookie')?.match(/user_session=([^;]+)/)?.[1];

  if (!userSessionValue) {
    throw new Error('세션 쿠키를 발급받지 못했습니다');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userSessionValue, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
};

/* 세션이 없거나 만료된 경우(401) 재발급 후 1회 재시도 */
export const completeOnboardingAction = async (): Promise<ActionResult> => {
  try {
    await completeOnboarding();
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    // 세션 없음/만료 시 게스트 세션 재발급 후 재시도
    if (error instanceof HttpError && error.status === 401) {
      try {
        await issueGuestSession();
        await completeOnboarding();
        revalidatePath('/');
        return { success: true };
      } catch (retryError) {
        console.error('[action] completeOnboarding 재시도 실패:', retryError);
        return {
          success: false,
          message: retryError instanceof Error ? retryError.message : 'Unknown error',
        };
      }
    }

    console.error('[action] completeOnboarding 실패:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

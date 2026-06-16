'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

type ActionResult = { success: true } | { success: false; message: string };

export const clearUserSessionAction = async (): Promise<ActionResult> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('user_session');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('[action] user_session 삭제 실패:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

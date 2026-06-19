'use server';

import { revalidatePath } from 'next/cache';

export const revalidateMypageAction = async () => {
  revalidatePath('/mypage');
  revalidatePath('/mypage/list');
};

export const revalidateHomeAction = async () => {
  revalidatePath('/');
};

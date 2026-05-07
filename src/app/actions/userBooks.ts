'use server';

import { revalidatePath } from 'next/cache';

export const revalidateHomeAction = async () => {
  revalidatePath('/');
};

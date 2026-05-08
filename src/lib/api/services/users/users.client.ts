import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';

export type PatchLastSelectedUserBookRequest = {
  lastSelectedUserBookId: number;
};

export const patchLastSelectedUserBookId = async (userBookId: number) => {
  await publicHttp.patch<PatchLastSelectedUserBookRequest, unknown>(ENDPOINTS.USERS.me(), {
    lastSelectedUserBookId: userBookId,
  });
};

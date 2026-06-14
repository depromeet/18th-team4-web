import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type UpdateNicknameRequest, type UpdateNicknameResponse } from './users.type';

export type PatchLastSelectedUserBookRequest = {
  lastSelectedUserBookId: number;
};

export const patchLastSelectedUserBookId = async (userBookId: number) => {
  await publicHttp.patch<PatchLastSelectedUserBookRequest, unknown>(ENDPOINTS.USERS.me(), {
    lastSelectedUserBookId: userBookId,
  });
};

export const updateNickname = async (params: UpdateNicknameRequest) => {
  const response = await publicHttp.put<UpdateNicknameRequest, UpdateNicknameResponse>(
    ENDPOINTS.USERS.nickname(),
    params,
  );

  return response.data;
};

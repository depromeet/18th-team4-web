import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import { type UpdateNicknameRequest, type UpdateNicknameResponse } from './users.type';

export type PatchLastSelectedUserBookRequest = {
  lastSelectedUserBookId: number;
};

export const patchLastSelectedUserBookId = async (userBookId: number) => {
  // TODO: 백엔드에서 lastSelectedUserBookId를 PATCH할 수 있는 API를 제공 시 다시 연결한다.
  // await publicHttp.patch<PatchLastSelectedUserBookRequest, unknown>(ENDPOINTS.USERS.me(), {
  //   lastSelectedUserBookId: userBookId,
  // });
};

export const updateNickname = async (params: UpdateNicknameRequest) => {
  const response = await publicHttp.put<UpdateNicknameRequest, UpdateNicknameResponse>(
    ENDPOINTS.USERS.nickname(),
    params,
  );

  return response.data;
};

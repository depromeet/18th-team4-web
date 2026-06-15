// import { ENDPOINTS } from '@/constants';
// import { publicHttp } from '@/lib';

export type PatchLastSelectedUserBookRequest = {
  lastSelectedUserBookId: number;
};

export const patchLastSelectedUserBookId = async (userBookId: number) => {
  // TODO: 백엔드에서 lastSelectedUserBookId를 PATCH할 수 있는 API를 제공 시 다시 연결한다.
  // await publicHttp.patch<PatchLastSelectedUserBookRequest, unknown>(ENDPOINTS.USERS.me(), {
  //   lastSelectedUserBookId: userBookId,
  // });
};

import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import {
  type CompleteOnboardingResponse,
  type CreateUserSessionResponse,
  type UserSessionResponse,
} from './users.type';

/* 현재 세션 정보 조회 */
export const getUserSession = async () => {
  const response = await publicHttp.get<UserSessionResponse>(ENDPOINTS.USERS.me());

  return response.data;
};

/* 사용자 세션 생성 */
export const createUserSession = async () => {
  const response = await publicHttp.post<void, CreateUserSessionResponse>(ENDPOINTS.USERS.create());

  return response.data;
};

/* 온보딩 완료 처리 */
export const completeOnboarding = async () => {
  const response = await publicHttp.post<void, CompleteOnboardingResponse>(
    ENDPOINTS.USERS.onboarding(),
  );

  return response.data;
};

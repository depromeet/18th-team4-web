import { cache } from 'react';
import { ENDPOINTS } from '@/constants';
import { publicHttp } from '@/lib';
import {
  type CompleteOnboardingResponse,
  type CreateUserSessionResponse,
  type UserProfileResponse,
  type UserSessionResponse,
} from './users.type';

/* 현재 세션 정보 조회 (요청 단위 캐시 — layout/page 어디서 호출해도 API는 1번만 호출됨) */
export const getUserSession = cache(async () => {
  const response = await publicHttp.get<UserSessionResponse>(ENDPOINTS.USERS.me());

  return response.data;
});

/* 내 프로필 조회 */
export const getUserProfile = cache(async () => {
  const response = await publicHttp.get<UserProfileResponse>(ENDPOINTS.USERS.profile());

  return response.data;
});

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

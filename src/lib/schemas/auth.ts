/*
 *  로그인 관련 로직 Schema
 */
import { z } from "zod";

/*
 *  유저 로그인
 *  Route: /login
 */
export const AuthSignInSchema = z.object({
  memberId: z.string(),
  password: z.string(),
});

/*
 *  비밀번호 찾기
 *  Route: /find/password/form
 */
export const FindPasswordSchema = z.object({
  newPassword: z.string(),
  newPasswordConfirm: z.string(),
});

/*
 *  회원가입
 *  Route: /signup/form
 */
export const SignupFormSchema = z.object({
  clientTxId: z.string(),
  basicUserInfo: z.object({
    memberId: z.string(),
    password: z.string(),
    passwordConfirm: z.string(),
    email: z.string(),
    zipCode: z.string(),
    address: z.string(),
    detailAddress: z.string(),
  }),
  profileInfo: z.object({
    residenceAddress: z.string().optional(),
    educationLevel: z.string().optional(),
    majorRequirement: z.string().optional(),
    marriageStatus: z.string().optional(),
    employmentStatus: z.string().optional(),
    minAnnualIncome: z.number().nullable().optional(),
    maxAnnualIncome: z.number().nullable().optional(),
  }),
  termsUserAgreements: z.object({
    termIds: z.array(z.number()),
  }),
});

/*
 *  마이페이지 프로필정보 수정
 *  Route: /api/auth
 */
export const EditMoreProfileSchema = z.object({
  userInfo: z.object({
    email: z.string(),
    zipCode: z.string(),
    address: z.string(),
    detailAddress: z.string(),
  }),
  profileInfo: z.object({
    residenceAddress: z.string().nullish(),
    educationLevel: z.string().nullish(),
    majorRequirement: z.string().nullish(),
    employmentStatus: z.string().nullish(),
    marriageStatus: z.string().nullish(),
    minAnnualIncome: z.number().nullable().optional(),
    maxAnnualIncome: z.number().nullable().optional(),
  }),
});

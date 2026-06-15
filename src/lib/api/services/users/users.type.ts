import z from 'zod';
import {
  CompleteOnboardingResponseSchema,
  CreateUserSessionResponseSchema,
  SessionSchema,
  UpdateNicknameRequestSchema,
  UpdateNicknameResponseSchema,
  UserProfileResponseSchema,
  UserProfileSchema,
  UserSessionRequestSchema,
  UserSessionResponseSchema,
} from './users.zod';

export type UserSessionResponse = z.infer<typeof UserSessionResponseSchema>;
export type UserSessionRequest = z.infer<typeof UserSessionRequestSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UpdateNicknameRequest = z.infer<typeof UpdateNicknameRequestSchema>;
export type UpdateNicknameResponse = z.infer<typeof UpdateNicknameResponseSchema>;
export type CreateUserSessionResponse = z.infer<typeof CreateUserSessionResponseSchema>;
export type CompleteOnboardingResponse = z.infer<typeof CompleteOnboardingResponseSchema>;
export type Session = z.infer<typeof SessionSchema>;

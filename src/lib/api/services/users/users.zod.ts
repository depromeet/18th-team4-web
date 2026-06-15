import z from 'zod';
import { createResponseSchema } from '@/lib';

export const SessionSchema = z.object({
  lastSelectedUserBookId: z.number(),
  hasRegisteredBooks: z.boolean(),
  onboardingCompleted: z.boolean(),
});

export const UserSessionDataSchema = z.object({
  session: SessionSchema,
});

export const UserSessionResponseSchema = createResponseSchema(UserSessionDataSchema);

export const UserSessionRequestSchema = z.object({
  user_session: z.string(),
});

export const UserProfileSchema = z.object({
  nickname: z.string(),
});

export const UserProfileDataSchema = z.object({
  profile: UserProfileSchema,
});

export const UserProfileResponseSchema = createResponseSchema(UserProfileDataSchema);

export const UpdateNicknameRequestSchema = z.object({
  nickname: z.string().trim().min(1).max(10),
});

export const UpdateNicknameDataSchema = z.object({
  user: UserProfileSchema,
});

export const UpdateNicknameResponseSchema = createResponseSchema(UpdateNicknameDataSchema);

export const UserSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
});

export const CreateUserSessionDataSchema = z.object({
  user: UserSchema,
});

export const CreateUserSessionResponseSchema = createResponseSchema(CreateUserSessionDataSchema);

export const CompleteOnboardingDataSchema = z.object({
  user: UserSchema,
});

export const CompleteOnboardingResponseSchema = createResponseSchema(CompleteOnboardingDataSchema);

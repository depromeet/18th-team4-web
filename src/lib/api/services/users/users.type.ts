import z from 'zod';
import {
  CompleteOnboardingResponseSchema,
  CreateUserSessionResponseSchema,
  SessionSchema,
  UserSessionRequestSchema,
  UserSessionResponseSchema,
} from './users.zod';

export type UserSessionResponse = z.infer<typeof UserSessionResponseSchema>;
export type UserSessionRequest = z.infer<typeof UserSessionRequestSchema>;
export type CreateUserSessionResponse = z.infer<typeof CreateUserSessionResponseSchema>;
export type CompleteOnboardingResponse = z.infer<typeof CompleteOnboardingResponseSchema>;
export type Session = z.infer<typeof SessionSchema>;

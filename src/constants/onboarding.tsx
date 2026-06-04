import { type StaticImageData } from 'next/image';
import { type ReactNode } from 'react';
import { HomeLogo, Onboarding1, Onboarding2 } from '@/assets';

export type OnboardingStep = {
  id: string;
  title: ReactNode;
  image: StaticImageData | null;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'intro',
    title: (
      <>
        읽은 것을 내 것으로,
        <br />
        나만의 AI 독서 친구
      </>
    ),
    image: Onboarding1,
  },
  {
    id: 'organize',
    title: (
      <>
        대화만 나눠도
        <br />
        깔끔하게 정리되는 생각
      </>
    ),
    image: Onboarding2,
  },
  {
    id: 'login',
    title: null,
    image: HomeLogo,
  },
];

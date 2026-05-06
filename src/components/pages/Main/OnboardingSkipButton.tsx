'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { completeOnboardingAction } from '@/app/actions/users';

export const OnboardingSkipButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSkip = () => {
    startTransition(async () => {
      await completeOnboardingAction();
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleSkip}
      disabled={isPending}
      className="body1-bold text-center tracking-[-0.048rem] text-text-caption disabled:opacity-50"
    >
      {isPending ? '처리 중...' : '둘러보기'}
    </button>
  );
};

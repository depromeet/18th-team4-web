'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { completeOnboardingAction } from '@/app/actions/users';

export const OnboardingSkipButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSkip = () => {
    startTransition(async () => {
      const result = await completeOnboardingAction();
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleSkip}
      disabled={isPending}
      className="body1-bold cursor-pointer touch-manipulation px-[2.4rem] py-[1.2rem] text-center tracking-[-0.048rem] text-text-caption disabled:opacity-50"
    >
      {isPending ? '넘어가는중...' : '넘어가기'}
    </button>
  );
};

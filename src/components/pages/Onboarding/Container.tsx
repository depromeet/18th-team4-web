'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { completeOnboardingAction } from '@/app/actions';
import { Logo } from '@/assets';
import { Button, BUTTON_VARIANT } from '@/components';
import { ONBOARDING_STEPS } from '@/constants';
import { useToastStore } from '@/lib';
import { StepProgress } from './StepProgress';

export const OnboardingContainer = () => {
  const router = useRouter();
  const openToast = useToastStore((s) => s.openToast);
  const [isPending, startTransition] = useTransition();
  const [stepIndex, setStepIndex] = useState(0);

  const step = ONBOARDING_STEPS[stepIndex];
  if (!step) return null;

  const stepIds = ONBOARDING_STEPS.map((s) => s.id);
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;

  const handleNextClick = () => setStepIndex((i) => i + 1);

  const handleSkipLoginClick = () => {
    startTransition(async () => {
      const result = await completeOnboardingAction();

      if (!result.success) {
        openToast({ type: 'error', message: '잠시 후 다시 시도해주세요.' });
        return;
      }

      router.refresh();
    });
  };

  if (isLastStep) {
    return (
      <main className="relative flex h-dvh flex-col overflow-hidden bg-white">
        <section className="relative z-10 flex flex-1 flex-col items-center pt-[4.9rem]">
          <StepProgress stepIds={stepIds} activeId={step.id} />

          <figure className="mt-[5.2rem] flex flex-col items-center">
            <Image
              src={Logo}
              alt="Readum"
              priority
              className="h-[3.8rem] w-[21rem] object-contain"
            />
            <figcaption className="title1-bold mt-[1.8rem] text-center tracking-[-0.054rem] text-[#323539]">
              사유하는 독서가인
              <br />
              당신을 위해
            </figcaption>
          </figure>
          <div className="flex flex-1 items-center justify-center pt-[2rem]">
            <div className="relative h-[20.3rem] w-[23.8rem]">
              {step.image && (
                <Image
                  src={step.image}
                  alt="Readum book"
                  fill
                  priority
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </section>

        <footer className="relative z-10 mt-auto flex flex-col gap-[0.8rem] bg-gradient-to-b from-transparent to-white px-[2.4rem] pb-[2.4rem] pt-[4rem]">
          <Button
            variant={BUTTON_VARIANT.BLACK}
            size="lg"
            className="w-full"
            disabled={isPending}
            onClick={handleSkipLoginClick}
          >
            로그인 없이 시작하기
          </Button>
        </footer>
      </main>
    );
  }

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-white">
      <section className="relative z-10 flex flex-col items-center pt-[4.9rem]">
        <StepProgress stepIds={stepIds} activeId={step.id} />

        <h1 className="headline1-extrabold mt-[5.2rem] px-[2.4rem] text-center tracking-[-0.072rem] text-text-default">
          {step.title}
        </h1>
      </section>

      {step.image && (
        <div className="flex flex-1 items-center justify-center">
          <Image
            src={step.image}
            alt=""
            aria-hidden
            priority
            className="pointer-events-none h-[32.5rem] w-[25.2rem] object-contain"
          />
        </div>
      )}

      <footer className="relative z-10 mt-auto px-[2.4rem] pb-[2.4rem]">
        <Button
          variant={BUTTON_VARIANT.BLACK}
          size="lg"
          className="w-full"
          onClick={handleNextClick}
        >
          다음
        </Button>
      </footer>
    </main>
  );
};

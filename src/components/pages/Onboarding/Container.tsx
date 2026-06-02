'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { completeOnboardingAction } from '@/app/actions/users';
import { HomeLogo, Kakao, Logo, Onboarding1, Onboarding2 } from '@/assets';
import { Button, BUTTON_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';
import { cn } from '@/lib';

type Step = {
  title: React.ReactNode;
  image: StaticImageData | null;
};

const STEPS: Step[] = [
  {
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
    title: null,
    image: HomeLogo,
  },
];

export const OnboardingContainer = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stepIndex, setStepIndex] = useState(0);

  const step = STEPS[stepIndex];
  if (!step) return null;
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleNextClick = () => setStepIndex((i) => i + 1);

  const handleSkipLoginClick = () => {
    startTransition(async () => {
      const result = await completeOnboardingAction();
      if (result.success) router.push(PATH_NAME.main());
    });
  };

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-white">
      <div className="relative z-10 flex flex-col items-center pt-[4.9rem]">
        <div className="flex items-center gap-[0.5rem]">
          {STEPS.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={cn(
                'block h-[0.6rem] rounded-full transition-all',
                i === stepIndex ? 'w-[2.6rem] bg-icon-primary' : 'w-[0.6rem] bg-icon-disabled',
              )}
            />
          ))}
        </div>

        {isLastStep ? (
          <>
            <div className="mt-[5.2rem] flex flex-col items-center">
              <Image src={Logo} alt="Readum" priority className="h-[3.8rem] w-[21rem] object-contain" />
              <p className="title1-bold mt-[1.8rem] text-center tracking-[-0.054rem] text-[#323539]">
                사유하는 독서가인
                <br />
                당신을 위해
              </p>
            </div>
            <div className="relative mt-[1.9rem] h-[16.8rem] w-[22.1rem]">
              {step.image && (
                <Image src={step.image} alt="Readum book" fill priority className="object-contain" />
              )}
            </div>
          </>
        ) : (
          <h1 className="headline1-extrabold mt-[5.2rem] px-[2.4rem] text-center tracking-[-0.072rem] text-text-default">
            {step.title}
          </h1>
        )}
      </div>

      {!isLastStep && step.image && (
        <Image
          src={step.image}
          alt="Onboarding character"
          priority
          className="pointer-events-none absolute inset-x-0 bottom-[-7.8rem] h-auto w-full"
        />
      )}

      {isLastStep ? (
        <div className="relative z-10 mt-auto flex flex-col gap-[0.8rem] bg-gradient-to-b from-transparent to-white px-[2.4rem] pb-[2rem] pt-[4rem]">
          <button
            type="button"
            className="body1-bold flex h-[6rem] w-full cursor-pointer items-center justify-center gap-[1rem] rounded-2xl bg-[#FFE812] text-text-default"
          >
            <Kakao className="h-[1.8rem] w-[2rem]" />
            카카오로 로그인하기
          </button>
          <Button
            variant={BUTTON_VARIANT.BLACK}
            size="lg"
            className="w-full"
            disabled={isPending}
            onClick={handleSkipLoginClick}
          >
            로그인 없이 시작하기
          </Button>
        </div>
      ) : (
        <div className="relative z-10 mt-auto px-[2.4rem] pb-[2.4rem]">
          <Button
            variant={BUTTON_VARIANT.BLACK}
            size="lg"
            className="w-full"
            onClick={handleNextClick}
          >
            다음
          </Button>
        </div>
      )}
    </main>
  );
};

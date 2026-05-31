import Image from 'next/image';
import { GradientBg } from '@/assets';
import { LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { getUserBooksServer, type Session } from '@/lib';
import { MainBody } from './Body';
import { MainBooksShell } from './MainBooksShell';
import { OnboardingSkipButton } from './OnboardingSkipButton';

type Props = {
  session: Session | null;
};

export const MainContainer = async ({ session }: Props) => {
  // 1. 세션 없음(API 실패·race condition 폴백) 또는 온보딩 미완료
  if (session === null || !session.onboardingCompleted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-[2.4rem] px-[2.4rem]">
        <div className="flex flex-col items-center gap-[0.8rem]">
          <p className="headline2-extrabold text-center tracking-[-0.06rem] text-text-primary">
            Readum에 오신 걸 환영해요
          </p>
          <p className="body1-medium text-center tracking-[-0.048rem] text-text-caption">
            온보딩을 건너뛰고 바로 시작할 수 있어요
          </p>
        </div>
        <OnboardingSkipButton />
      </div>
    );
  }

  // 3. 온보딩 완료, 책 미등록
  if (!session.hasRegisteredBooks) {
    return (
      <div className="relative flex h-dvh overflow-hidden flex-col bg-background-primary-white">
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            top: 'calc(100% - 9rem)',
            height: 'calc(110dvh - 18rem)',
            width: 'calc(110dvh - 18rem)',
            maskImage: 'radial-gradient(circle, black 50%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 70%)',
          }}
          aria-hidden
        >
          <Image src={GradientBg} alt="" fill className="object-cover" sizes="100dvw" />
        </div>

        <MainBody />
        <div className="relative z-10 flex flex-col gap-[1.6rem] px-[2.4rem] pb-[2.4rem]">
          <LinkButton
            href={PATH_NAME.register.list()}
            size="lg"
            variant="black"
            className="rounded-[1.6rem]"
          >
            책 등록하기
          </LinkButton>
          <button
            type="button"
            className="body1-bold cursor-pointer text-center tracking-[-0.048rem] text-text-caption"
          >
            둘러보기
          </button>
        </div>
      </div>
    );
  }

  // 4. 온보딩 완료 + 책 등록 완료 — 풀버전 (records 있는 것으로 처리)
  const userBooksData = await getUserBooksServer().catch(() => null);
  const books = userBooksData?.books ?? [];

  const fromSessionId = session.lastSelectedUserBookId;
  const firstBookId = books[0]?.userBookId;
  const hasSessionBook =
    typeof fromSessionId === 'number' &&
    Number.isFinite(fromSessionId) &&
    books.some((b) => b.userBookId === fromSessionId);
  const initialSelectedUserBookId = hasSessionBook ? fromSessionId : firstBookId;

  if (initialSelectedUserBookId === undefined) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-[2.4rem] px-[2.4rem]">
        <p className="body1-medium text-center text-text-caption">책 목록을 불러오지 못했어요</p>
      </div>
    );
  }

  return <MainBooksShell books={books} initialSelectedUserBookId={initialSelectedUserBookId} />;
};

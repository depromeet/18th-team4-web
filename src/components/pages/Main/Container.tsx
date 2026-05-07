import { LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { getUserBooks, type Session } from '@/lib';
import { MainBody } from './Body';
import { MainFooter } from './Footer';
import { OnboardingSkipButton } from './OnboardingSkipButton';
import { RecordsBody } from './RecordsBody';

type Props = {
  session: Session | null;
};

export const MainContainer = async ({ session }: Props) => {
  // 1. 세션 데이터 없음 — API 호출 실패 또는 첫 렌더 race condition 폴백
  if (session === null) {
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

  // 2. 온보딩 미완료
  if (!session.onboardingCompleted) {
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
      <div className="flex min-h-dvh flex-col">
        <MainBody />
        <div className="flex flex-col gap-[1.6rem] px-[2.4rem] pb-[2.4rem]">
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
            className="body1-bold text-center tracking-[-0.048rem] text-text-caption"
          >
            둘러보기
          </button>
        </div>
      </div>
    );
  }

  // 4. 온보딩 완료 + 책 등록 완료 — 풀버전 (records 있는 것으로 처리)
  const userBooksData = await getUserBooks().catch(() => null);
  const books = userBooksData?.books ?? [];
  const userBookId = session.lastSelectedUserBookId || books[0]?.userBookId;

  return (
    <div className="flex h-dvh flex-col">
      {!!userBookId && <RecordsBody userBookId={userBookId} />}
      <div className="mt-[10.2rem]" />
      <MainFooter books={books} />
    </div>
  );
};

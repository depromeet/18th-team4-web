import { redirect } from 'next/navigation';
import { OnboardingContainer } from '@/components';
import { PATH_NAME } from '@/constants';
import { getUserBooksServer, type Session } from '@/lib';
import { MainBooksShell } from './MainBooksShell';

type Props = {
  session: Session | null;
};

export const MainContainer = async ({ session }: Props) => {
  // 1. 세션 없음(API 실패·race condition 폴백) 또는 온보딩 미완료
  if (session === null || !session.onboardingCompleted) {
    return <OnboardingContainer />;
  }

  // 2. 온보딩 완료, 책 미등록 — 책 등록 페이지로
  if (!session.hasRegisteredBooks) {
    redirect(PATH_NAME.register.list());
  }

  // 3. 온보딩 완료 + 책 등록 완료
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

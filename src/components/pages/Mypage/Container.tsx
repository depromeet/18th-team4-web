'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { clearUserSessionAction } from '@/app/actions';
import {
  Button,
  BUTTON_VARIANT,
  ChevronIcon,
  Header,
  HEADER_VARIANT,
  Modal,
  PencilIcon,
  ProfileImageIcon,
  TabView,
} from '@/components';
import { type ModalType, MYPAGE_TAB, PATH_NAME } from '@/constants';
import { useMypageTab } from '@/hooks';
import {
  type SummaryListData,
  useGetSummaries,
  useGetUserBooks,
  type UserBookItem,
  type UserProfile,
  useToastStore,
  useUpdateNickname,
} from '@/lib';
import { ProfileLightbox } from './ProfileLightbox';
import { Records } from './Records';
import { RegisteredBooks } from './RegisteredBooks';

const OPINION_FORM_URL = 'https://forms.gle/7bviar4fy8NwSc549';

const ACCOUNT_MENUS = [
  { key: 'opinion', label: '의견 남기기' },
  { key: 'logout', label: '로그아웃' },
  { key: 'withdraw', label: '회원탈퇴' },
] as const;

const NICKNAME_PATTERN = /^[A-Za-z0-9가-힣]+$/;

type Props = {
  initialProfile: UserProfile | null;
  initialBooks: UserBookItem[];
  initialBooksHasNext?: boolean;
  initialSummaries: SummaryListData | null;
};

export const MypageContainer = (props: Props) => {
  const { initialBooks, initialBooksHasNext = false, initialProfile, initialSummaries } = props;
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);
  const [nickname, setNickname] = useState(initialProfile?.nickname ?? 'Readum 사용자');
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [modalType, setModalType] = useState<Extract<ModalType, 'LOGOUT' | 'WITHDRAW'>>('LOGOUT');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isClearingSession, setIsClearingSession] = useState(false);
  const { activeTab, changeTab } = useMypageTab(PATH_NAME.mypage.main);
  const { data: userBooksData } = useGetUserBooks();
  const { data: summariesQueryData } = useGetSummaries(initialSummaries);
  const { mutateAsync: updateNickname, isPending: isUpdatingNickname } = useUpdateNickname();
  const openToast = useToastStore((s) => s.openToast);
  const books = userBooksData?.books ?? initialBooks;
  const booksHasNext = userBooksData?.hasNext ?? initialBooksHasNext;
  const summaries = summariesQueryData?.pages[0] ?? initialSummaries;
  const trimmedNickname = nicknameInput.trim();
  const isNicknameValid =
    trimmedNickname.length >= 1 &&
    trimmedNickname.length <= 10 &&
    NICKNAME_PATTERN.test(trimmedNickname);

  const openNicknameModal = () => {
    setNicknameInput(nickname);
    setIsNicknameOpen(true);
  };

  const closeNicknameModal = () => {
    if (isUpdatingNickname) return;
    setIsNicknameOpen(false);
  };

  const handleSubmitNickname = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isNicknameValid || isUpdatingNickname) return;

    try {
      const data = await updateNickname({ nickname: trimmedNickname });
      setNickname(data.user.nickname);
      setIsNicknameOpen(false);
      router.refresh();
    } catch {
      openToast({
        type: 'error',
        message: '닉네임을 수정하지 못했어요. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const handleAccountMenuClick = (menuKey: (typeof ACCOUNT_MENUS)[number]['key']) => {
    if (menuKey === 'opinion') {
      window.open(OPINION_FORM_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    setModalType(menuKey === 'logout' ? 'LOGOUT' : 'WITHDRAW');
    setIsAccountModalOpen(true);
  };

  const handleConfirmAccountModal = async () => {
    if (isClearingSession) return;

    setIsClearingSession(true);
    const result = await clearUserSessionAction();
    setIsClearingSession(false);

    if (!result.success) {
      openToast({ type: 'error', message: '처리에 실패했어요. 다시 시도해주세요.' });
      return;
    }

    setIsAccountModalOpen(false);
    router.replace(PATH_NAME.main());
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header
        variant={HEADER_VARIANT.BACK}
        onBack={() => router.push(PATH_NAME.main())}
        className="bg-white"
      />

      <section className="flex flex-col items-center gap-[1.2rem] px-[2.4rem] pb-[1.2rem] pt-[2.4rem]">
        <button
          type="button"
          aria-label="프로필 이미지 확대"
          onClick={() => setIsProfileOpen(true)}
          className="flex size-[8rem] cursor-zoom-in items-center justify-center rounded-full bg-green-darkest"
        >
          <ProfileImageIcon className="block h-[5.6rem] w-auto shrink-0" />
        </button>
        <div className="flex items-center gap-[0.4rem]">
          <span className="headline2-bold text-text-default">{nickname}</span>
          <button
            type="button"
            aria-label="닉네임 수정"
            onClick={openNicknameModal}
            className="flex size-[2.4rem] shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-alpha-50 p-[0.6rem]"
          >
            <PencilIcon className="size-[1.2rem]" />
          </button>
        </div>
      </section>

      <TabView
        value={activeTab}
        onValueChange={changeTab}
        tabs={[
          {
            value: MYPAGE_TAB.REGISTERED,
            label: '등록된 책',
            count: books.length,
            content: <RegisteredBooks books={books} hasMore={booksHasNext} />,
          },
          {
            value: MYPAGE_TAB.RECORDS,
            label: '감상 기록',
            count: summaries?.summaries.length ?? 0,
            content: <Records initialSummaries={summaries} />,
          },
        ]}
      />

      <div className="h-[1.4rem] w-full bg-gray-alpha-10" />

      <nav className="flex flex-col pb-[4rem] pt-[1.2rem]">
        {ACCOUNT_MENUS.map((menu) => (
          <button
            key={menu.key}
            type="button"
            onClick={() => handleAccountMenuClick(menu.key)}
            className="body1-bold flex w-full cursor-pointer items-center justify-between gap-[1rem] px-[2.4rem] py-[1rem] tracking-[-0.064rem] text-text-caption"
          >
            {menu.label}
            <ChevronIcon className="-rotate-90 size-[2.4rem] fill-icon-quaternary" />
          </button>
        ))}
      </nav>

      <ProfileLightbox isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {isNicknameOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center px-[2.4rem]">
          <button
            type="button"
            aria-label="닉네임 수정 닫기"
            className="absolute inset-0 cursor-pointer bg-dim"
            onClick={closeNicknameModal}
          />

          <form
            onSubmit={(e) => void handleSubmitNickname(e)}
            className="relative flex w-full max-w-[33rem] flex-col overflow-hidden rounded-[2rem] bg-white p-[2.4rem] pt-[2.8rem]"
          >
            <header className="flex flex-col items-center gap-[0.4rem] text-center">
              <h3 className="headline2-bold text-text-default">닉네임 수정</h3>
              <p className="body2-medium text-text-description">1~10자의 닉네임을 입력해주세요.</p>
            </header>

            <label className="mt-[2.4rem] flex flex-col gap-[0.8rem]">
              <span className="sr-only">닉네임</span>
              <input
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={10}
                autoFocus
                className="body1-bold h-[5.2rem] w-full rounded-[1.2rem] bg-gray-alpha-50 px-[1.6rem] text-center text-text-default outline-none placeholder:text-text-disable"
                placeholder="닉네임"
                disabled={isUpdatingNickname}
              />
              <span className="caption1-medium min-h-[1.7rem] text-center text-text-disable">
                {trimmedNickname && !isNicknameValid
                  ? '영문, 한글, 숫자로 1~10자까지 입력할 수 있어요.'
                  : `${trimmedNickname.length}/10`}
              </span>
            </label>

            <footer className="mt-[2rem] flex w-full gap-[1rem]">
              <Button
                type="button"
                variant={BUTTON_VARIANT.LIGHTGRAY}
                size="lg"
                className="rounded-[1.6rem]"
                onClick={closeNicknameModal}
                disabled={isUpdatingNickname}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant={BUTTON_VARIANT.BLACK}
                size="lg"
                className="rounded-[1.6rem]"
                disabled={!isNicknameValid || isUpdatingNickname}
              >
                확인
              </Button>
            </footer>
          </form>
        </div>
      )}

      <Modal
        modalType={modalType}
        isOpen={isAccountModalOpen}
        onCancel={() => {
          if (!isClearingSession) setIsAccountModalOpen(false);
        }}
        onConfirm={() => void handleConfirmAccountModal()}
        confirmDisabled={isClearingSession}
      />
    </div>
  );
};

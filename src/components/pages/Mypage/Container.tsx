'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
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
import { MOCK_BOOKS, MOCK_RECORDS } from '@/lib';
import { ProfileLightbox } from './ProfileLightbox';
import { Records } from './Records';
import { RegisteredBooks } from './RegisteredBooks';

const OPINION_FORM_URL = 'https://forms.gle/7bviar4fy8NwSc549';

const ACCOUNT_MENUS = [
  { key: 'opinion', label: '의견 남기기' },
  { key: 'logout', label: '로그아웃' },
  { key: 'withdraw', label: '회원탈퇴' },
] as const;

export const MypageContainer = () => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalType, setModalType] = useState<Extract<ModalType, 'LOGOUT' | 'WITHDRAW'>>('LOGOUT');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { activeTab, changeTab } = useMypageTab(PATH_NAME.mypage.main);

  const handleAccountMenuClick = (menuKey: (typeof ACCOUNT_MENUS)[number]['key']) => {
    if (menuKey === 'opinion') {
      window.open(OPINION_FORM_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    setModalType(menuKey === 'logout' ? 'LOGOUT' : 'WITHDRAW');
    setIsAccountModalOpen(true);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} className="bg-white" />

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
          <span className="headline2-bold text-text-default">멋쟁이곰돌이2403</span>
          <button
            type="button"
            aria-label="닉네임 수정"
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
            count: MOCK_BOOKS.length,
            content: <RegisteredBooks />,
          },
          {
            value: MYPAGE_TAB.RECORDS,
            label: '감상 기록',
            count: MOCK_RECORDS.length,
            content: <Records />,
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
      <Modal
        modalType={modalType}
        isOpen={isAccountModalOpen}
        onCancel={() => setIsAccountModalOpen(false)}
        onConfirm={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

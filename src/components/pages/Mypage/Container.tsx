'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  ChevronIcon,
  Header,
  HEADER_VARIANT,
  PencilIcon,
  ProfileImageIcon,
  TabView,
} from '@/components';
import { PATH_NAME } from '@/constants';
import { MYPAGE_LIST_TAB } from './ListContainer';
import { ProfileLightbox } from './ProfileLightbox';
import { Records } from './Records';
import { RegisteredBooks } from './RegisteredBooks';

type MypageTab = (typeof MYPAGE_LIST_TAB)[keyof typeof MYPAGE_LIST_TAB];

const ACCOUNT_MENUS = [
  { key: 'logout', label: '로그아웃' },
  { key: 'withdraw', label: '회원탈퇴' },
] as const;

export const MypageContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 활성 탭을 ?tab= 쿼리와 동기화한다(리로드/뒤로가기 시에도 유지).
  const [activeTab, setActiveTab] = useState<MypageTab>(() =>
    searchParams.get('tab') === MYPAGE_LIST_TAB.RECORDS
      ? MYPAGE_LIST_TAB.RECORDS
      : MYPAGE_LIST_TAB.REGISTERED,
  );

  // 페이지 재이동(리마운트) 없이 URL의 tab 쿼리만 갱신 → 슬라이드 애니메이션 유지.
  const handleTabChange = (next: string) => {
    setActiveTab(next as MypageTab);
    window.history.replaceState(null, '', `${PATH_NAME.mypage.main()}?tab=${next}`);
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
        onValueChange={handleTabChange}
        tabs={[
          {
            value: MYPAGE_LIST_TAB.REGISTERED,
            label: '등록된 책',
            count: 13,
            content: <RegisteredBooks />,
          },
          {
            value: MYPAGE_LIST_TAB.RECORDS,
            label: '감상 기록',
            count: 24,
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
            className="body1-bold flex w-full cursor-pointer items-center justify-between gap-[1rem] px-[2.4rem] py-[1rem] tracking-[-0.064rem] text-text-caption"
          >
            {menu.label}
            <ChevronIcon className="-rotate-90 size-[2.4rem] fill-icon-quaternary" />
          </button>
        ))}
      </nav>

      <ProfileLightbox isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

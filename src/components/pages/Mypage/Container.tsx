'use client';

import { useRouter } from 'next/navigation';
import {
  ChevronIcon,
  Header,
  HEADER_VARIANT,
  PencilIcon,
  ProfileImageIcon,
  TabView,
} from '@/components';
import { Records } from './Records';
import { RegisteredBooks } from './RegisteredBooks';

const ACCOUNT_MENUS = [
  { key: 'logout', label: '로그아웃' },
  { key: 'withdraw', label: '회원탈퇴' },
] as const;

export const MypageContainer = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} />

      <section className="flex flex-col items-center gap-[1.2rem] px-[2.4rem] pb-[1.2rem] pt-[2.4rem]">
        <div className="flex size-[8rem] items-center justify-center rounded-full bg-green-darkest">
          <ProfileImageIcon className="h-[3.6rem] w-auto" />
        </div>
        <div className="flex items-center gap-[0.4rem]">
          <span className="headline2-bold text-text-default">멋쟁이곰돌이2403</span>
          <button
            type="button"
            aria-label="닉네임 수정"
            className="flex size-[3.2rem] shrink-0 cursor-pointer items-center justify-center rounded-full bg-disabled"
          >
            <PencilIcon className="size-[1.2rem]" />
          </button>
        </div>
      </section>

      <TabView
        defaultValue="registered"
        tabs={[
          {
            value: 'registered',
            label: '등록된 책',
            count: 13,
            content: <RegisteredBooks />,
          },
          {
            value: 'records',
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
    </div>
  );
};

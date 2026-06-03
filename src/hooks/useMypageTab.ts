'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MYPAGE_TAB, type MypageTab } from '@/constants';

const toTab = (value: string | null): MypageTab =>
  value === MYPAGE_TAB.RECORDS ? MYPAGE_TAB.RECORDS : MYPAGE_TAB.REGISTERED;

/**
 * 마이페이지 탭 상태를 `?tab=` 쿼리와 동기화한다.
 * 탭 전환 시 페이지 재이동(리마운트) 없이 URL만 갱신해 슬라이드 애니메이션을 유지한다.
 *
 * @param buildHref 선택된 탭에 대응하는 URL을 만드는 함수
 */
export const useMypageTab = (buildHref: (tab: MypageTab) => string) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<MypageTab>(() => toTab(searchParams.get('tab')));

  const changeTab = (next: string) => {
    const tab = toTab(next);
    setActiveTab(tab);
    window.history.replaceState(null, '', buildHref(tab));
  };

  return { activeTab, changeTab };
};

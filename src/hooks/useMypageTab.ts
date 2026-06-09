'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  // replaceState로 URL만 바꾸므로 Next 라우터는 이를 감지하지 못한다.
  // 브라우저 뒤로/앞으로 가기(popstate) 시 URL의 ?tab= 값으로 탭 상태를 되돌린다.
  useEffect(() => {
    const handlePopState = () => {
      const tab = new URLSearchParams(window.location.search).get('tab');
      setActiveTab(toTab(tab));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const changeTab = (next: string) => {
    const tab = toTab(next);
    setActiveTab(tab);
    window.history.replaceState(null, '', buildHref(tab));
  };

  return { activeTab, changeTab };
};

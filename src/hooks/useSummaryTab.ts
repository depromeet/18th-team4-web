'use client';

import { useCallback, useEffect, useState } from 'react';
import { PATH_NAME, SUMMARY_TAB, type SummaryTab } from '@/constants';

const toTab = (value: string | null): SummaryTab =>
  value === SUMMARY_TAB.CHAT ? SUMMARY_TAB.CHAT : SUMMARY_TAB.SUMMARY;

/**
 * 요약 페이지 탭 상태를 `?tab=` 쿼리와 동기화한다.
 * 탭 전환 시 페이지 재이동(리마운트) 없이 URL만 갱신한다(`history.replaceState`).
 *
 * 초기 탭은 서버에서 파싱해 내려준 `initialTab`을 사용한다(`?tab=chat` 진입 시 메시지 SSR prefetch 때문).
 *
 * @param summaryId  요약 id 또는 요약 세션 id (URL 생성용)
 * @param initialTab 서버에서 파싱한 초기 탭
 */
export const useSummaryTab = (summaryId: string, initialTab: SummaryTab, source?: 'session') => {
  const [activeTab, setActiveTab] = useState<SummaryTab>(initialTab);
  const getSummaryPath = useCallback(
    (tab: SummaryTab) =>
      source === 'session'
        ? PATH_NAME.summary.session(summaryId, tab)
        : PATH_NAME.summary.detail(summaryId, tab),
    [source, summaryId],
  );

  // 최초 진입 시 tab 파라미터가 없거나 유효하지 않으면 초기 탭 기준으로 URL을 정규화한다.
  useEffect(() => {
    window.history.replaceState(null, '', getSummaryPath(initialTab));
  }, [getSummaryPath, initialTab]);

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
    window.history.replaceState(null, '', getSummaryPath(tab));
  };

  return { activeTab, changeTab };
};

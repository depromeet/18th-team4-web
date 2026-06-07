'use client';

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from 'react';
import { cn } from '@/lib';
import { tabTriggerLabelVariants, tabTriggerVariants } from './tabViewVariants';

export type TabItem = {
  value: string;
  label: string;
  count?: number;
  content: ReactNode;
};

type Props = {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  stickyHeader?: boolean;
};

/**
 * 탭 헤더와 선택된 탭의 콘텐츠를 함께 렌더하는 공통 탭 컴포넌트.
 *
 * `tabs` config 배열로 각 탭의 라벨/카운트/패널 콘텐츠를 전달한다.
 * controlled(`value`) / uncontrolled(`defaultValue`) 모두 지원하며,
 * 좌/우 화살표 키로 탭 간 이동이 가능하다(ARIA Tabs 패턴).
 *
 * `onValueChange` 등 함수 prop은 클라이언트 컴포넌트에서만 전달할 수 있다.
 */
export const TabView = (props: Props) => {
  const { tabs, value, defaultValue, onValueChange, className, stickyHeader = false } = props;

  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isControlled = value !== undefined;
  const hasValue = (target?: string) =>
    target !== undefined && tabs.some((t) => t.value === target);
  const initialValue = hasValue(defaultValue) ? (defaultValue as string) : tabs[0]?.value;
  const [internalValue, setInternalValue] = useState(initialValue);

  if (tabs.length === 0) {
    console.error('TabView: `tabs`가 비어 있습니다. 최소 1개 이상의 탭이 필요합니다.');
    return null;
  }

  const rawValue = isControlled ? value : internalValue;
  const selectedValue = hasValue(rawValue) ? (rawValue as string) : tabs[0].value;
  const selectedIndex = tabs.findIndex((t) => t.value === selectedValue);
  const activeTab = tabs[selectedIndex];

  const selectTab = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
      return;
    }
    e.preventDefault();
    const direction = e.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (selectedIndex + direction + tabs.length) % tabs.length;
    selectTab(tabs[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  };

  const tabId = (tabValue: string) => `${baseId}-tab-${tabValue}`;
  const panelId = (tabValue: string) => `${baseId}-panel-${tabValue}`;

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div
        role="tablist"
        className={cn(
          'flex w-full justify-center px-[2.4rem]',
          stickyHeader && 'sticky top-0 z-10 bg-background-primary-white',
        )}
      >
        {tabs.map((tab, index) => {
          const isActiveTab = tab.value === selectedValue;

          return (
            <button
              key={tab.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.value)}
              aria-selected={isActiveTab}
              aria-controls={panelId(tab.value)}
              tabIndex={isActiveTab ? 0 : -1}
              className={cn(tabTriggerVariants({ active: isActiveTab }))}
              onClick={() => selectTab(tab.value)}
              onKeyDown={handleKeyDown}
            >
              <span className={cn(tabTriggerLabelVariants({ active: isActiveTab }))}>
                {tab.label}
              </span>
              {tab.count !== undefined && (
                <span className="body1-extrabold text-text-default">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={panelId(activeTab.value)} aria-labelledby={tabId(activeTab.value)}>
        {activeTab.content}
      </div>
    </div>
  );
};

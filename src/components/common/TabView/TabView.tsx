'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib';
import { tabTriggerLabelVariants, tabTriggerVariants } from './tabViewVariants';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
};

/**
 * 탭 헤더와 선택된 탭의 콘텐츠를 함께 렌더하는 공통 탭 컴포넌트.
 *
 * `tabs` config 배열로 각 탭의 라벨/카운트/패널 콘텐츠를 전달한다.
 * controlled(`value`) / uncontrolled(`defaultValue`) 모두 지원하며,
 * 좌/우 화살표 키로 탭 간 이동이 가능하다(ARIA Tabs 패턴).
 *
 * 탭 전환 시 하이라이트(밑줄)와 패널이 함께 슬라이드되며, 패널 높이도 부드럽게 전환된다.
 *
 * `onValueChange` 등 함수 prop은 클라이언트 컴포넌트에서만 전달할 수 있다.
 */
export const TabView = (props: Props) => {
  const { tabs, value, defaultValue, onValueChange, className } = props;

  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [trackHeight, setTrackHeight] = useState<number | undefined>(undefined);

  // 첫 렌더에서는 슬라이드 없이 초기 탭(defaultValue) 위치에서 곧바로 시작하고,
  // 마운트 이후의 탭 전환부터 슬라이드 애니메이션을 적용한다.
  const [enableSlide, setEnableSlide] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnableSlide(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isControlled = value !== undefined;
  const hasValue = (target?: string) =>
    target !== undefined && tabs.some((t) => t.value === target);
  const initialValue = hasValue(defaultValue) ? (defaultValue as string) : tabs[0]?.value;
  const [internalValue, setInternalValue] = useState(initialValue);

  const rawValue = isControlled ? value : internalValue;
  const safeValue = hasValue(rawValue) ? (rawValue as string) : tabs[0]?.value;
  const selectedIndex = Math.max(
    0,
    tabs.findIndex((t) => t.value === safeValue),
  );

  // 선택된 패널 높이에 맞춰 트랙 높이를 동기화한다(콘텐츠 변경/리사이즈 대응).
  useIsomorphicLayoutEffect(() => {
    const el = panelRefs.current[selectedIndex];
    if (!el) return;

    const sync = () => setTrackHeight(el.offsetHeight);
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [selectedIndex, tabs]);

  if (tabs.length === 0) {
    return null;
  }

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
      <div role="tablist" className="relative flex w-full px-[2.4rem]">
        {tabs.map((tab, index) => {
          const isActiveTab = index === selectedIndex;

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
              className={cn(tabTriggerVariants())}
              onClick={() => selectTab(tab.value)}
              onKeyDown={handleKeyDown}
            >
              <span
                className={cn(
                  'transition-colors duration-300',
                  tabTriggerLabelVariants({ active: isActiveTab }),
                )}
              >
                {tab.label}
              </span>
              {tab.count !== undefined && (
                <span className="body1-extrabold text-text-default">{tab.count}</span>
              )}
            </button>
          );
        })}

        {/* 슬라이드되는 하이라이트(밑줄) */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[2.4rem] right-[2.4rem]"
        >
          <span
            className={cn(
              'block h-[0.14rem] rounded-full bg-icon-secondary',
              enableSlide && 'transition-transform duration-300 ease-out',
            )}
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${selectedIndex * 100}%)`,
            }}
          />
        </span>
      </div>

      <div
        className={cn(
          'overflow-hidden',
          enableSlide && 'transition-[height] duration-300 ease-out',
        )}
        style={{ height: trackHeight }}
      >
        <div
          className={cn('flex', enableSlide && 'transition-transform duration-300 ease-out')}
          style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
        >
          {tabs.map((tab, index) => {
            const isActiveTab = index === selectedIndex;

            return (
              <div
                key={tab.value}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                role="tabpanel"
                id={panelId(tab.value)}
                aria-labelledby={tabId(tab.value)}
                aria-hidden={!isActiveTab}
                className={cn('w-full shrink-0 self-start', !isActiveTab && 'pointer-events-none')}
              >
                {tab.content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

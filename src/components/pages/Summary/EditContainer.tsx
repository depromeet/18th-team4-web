'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME, SUMMARY_TAB } from '@/constants';
import { type SummaryData, useSummary, useToastStore, useUpdateSummary } from '@/lib';

type Props = {
  summaryId: string;
  initialSummary: SummaryData | null;
};

export const SummaryEditContainer = (props: Props) => {
  const { summaryId, initialSummary } = props;
  const router = useRouter();
  const openToast = useToastStore((state) => state.openToast);
  const { mutate: saveSummary, isPending } = useUpdateSummary(summaryId);

  const { data } = useSummary(summaryId, { initialData: initialSummary });
  const [title, setTitle] = useState(data?.title ?? '');
  const [body, setBody] = useState(data?.body ?? '');
  const [hydrated, setHydrated] = useState(!!data);

  // 직접 진입(클라 캐시 없음)으로 data가 비동기 도착하면 최초 1회 폼에 반영한다.
  // 렌더 중 동기화 패턴(React 공식) — effect 내 setState 없이, 한 번만 채워 사용자 입력을 보존한다.
  if (data && !hydrated) {
    setHydrated(true);
    setTitle(data.title);
    setBody(data.body);
  }

  const handleBack = () => router.push(PATH_NAME.summary.detail(summaryId, SUMMARY_TAB.SUMMARY));

  const handleSave = () => {
    const nextTitle = title.trim();
    const nextBody = body.trim();

    if (!nextTitle || !nextBody) {
      openToast({ type: 'error', message: '제목과 내용을 모두 입력해주세요.' });
      return;
    }

    saveSummary(
      { title: nextTitle, body: nextBody },
      {
        onSuccess: () => router.push(PATH_NAME.summary.detail(summaryId, SUMMARY_TAB.SUMMARY)),
        onError: () =>
          openToast({ type: 'error', message: '저장에 실패했어요. 다시 시도해주세요.' }),
      },
    );
  };

  return (
    <div className="flex h-dvh flex-col bg-background-primary-white">
      <Header
        variant={HEADER_VARIANT.BACK}
        className="justify-between bg-text-white"
        onBack={handleBack}
        rightSlot={
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="body1-bold cursor-pointer tracking-[-0.04em] text-icon-primary disabled:cursor-default disabled:opacity-50"
          >
            저장
          </button>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[1.2rem] px-[2.4rem] pt-[3.2rem] pb-[2.4rem]">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="요약 제목"
          className="headline1-extrabold w-full tracking-[-0.03em] text-text-default outline-none placeholder:text-text-caption"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="요약 내용을 입력하세요."
          className="caption1-medium-reading w-full flex-1 resize-none tracking-[-0.03em] text-text-description outline-none placeholder:text-text-caption"
        />
      </div>
    </div>
  );
};

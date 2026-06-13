'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { PATH_NAME } from '@/constants';

type Props = {
  summaryId: string;
  showEdit?: boolean;
};

export const SummaryHeader = (props: Props) => {
  const { summaryId, showEdit = false } = props;
  const router = useRouter();
  const handleBack = () => router.push(PATH_NAME.main());

  return (
    <Header
      variant={HEADER_VARIANT.BACK}
      className="justify-between bg-text-white"
      onBack={handleBack}
      rightSlot={
        showEdit ? (
          <Link
            href={PATH_NAME.summary.edit(summaryId)}
            className="body1-bold tracking-[-0.04em] text-icon-primary"
          >
            편집
          </Link>
        ) : undefined
      }
    />
  );
};

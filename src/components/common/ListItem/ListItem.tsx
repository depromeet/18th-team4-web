'use client';

import { type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { useState } from 'react';
import { BookCoverPlaceholder } from '@/assets';
import { SelectIcon } from '@/components';
import { cn } from '@/lib';
import { listItemVariants } from './listItemVariants';

type Props = VariantProps<typeof listItemVariants> & {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  year?: number;
  publisher?: string;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
};

/** `trimmedSrc`(key) 변경 시 리마운트로 로드 실패 상태를 초기화한다. */
type ListItemThumbProps = {
  trimmedSrc: string;
  alt: string;
};

const ListItemThumb = (props: ListItemThumbProps) => {
  const { trimmedSrc, alt } = props;

  const [loadFailed, setLoadFailed] = useState(false);

  const usePlaceholder = trimmedSrc.length === 0 || loadFailed;

  return (
    <div
      className={cn(
        'relative h-[7.3rem] w-20 shrink-0 overflow-hidden rounded-[0.6rem]',
        !usePlaceholder && 'border border-gray-alpha-100 shadow-[0_0_3.2rem_rgba(0,0,0,0.12)]',
      )}
    >
      {usePlaceholder ? (
        <BookCoverPlaceholder
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ) : (
        <Image
          src={trimmedSrc}
          alt={alt}
          fill
          className="pointer-events-none object-cover"
          onError={() => setLoadFailed(true)}
        />
      )}
    </div>
  );
};

export const ListItem = (props: Props) => {
  const {
    imageSrc,
    imageAlt = '',
    title,
    year = 2000,
    publisher = '출판사/저자',
    selected = false,
    className,
    onClick,
  } = props;

  const trimmedSrc = imageSrc.trim();

  return (
    <li className="min-w-0 max-w-full">
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(listItemVariants({ selected }), 'min-w-0 max-w-full', className)}
      >
        <ListItemThumb key={trimmedSrc} trimmedSrc={trimmedSrc} alt={imageAlt} />

        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="title1-bold w-full truncate text-text-default">{title}</p>
          <p className="body2-medium w-full truncate text-text-caption">
            {`${year} | ${publisher}`}
          </p>
        </div>

        {selected && <SelectIcon aria-hidden className="size-[2.8rem] shrink-0 self-center" />}
      </button>
    </li>
  );
};

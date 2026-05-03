import { type VariantProps } from 'class-variance-authority';
import { CheckIcon } from '@/components';
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

export const ListItem = (props: Props) => {
  const {
    imageSrc,
    imageAlt = '',
    title,
    year = '2000',
    publisher = '출판사/저자',
    selected = false,
    className,
    onClick,
  } = props;

  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(listItemVariants({ selected }), className)}
      >
        <div className="relative h-[7.3rem] w-20 shrink-0 overflow-hidden rounded-[0.6rem] border border-gray-alpha-100 shadow-[0_0_3.2rem_rgba(0,0,0,0.12)]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="title1-bold w-full truncate text-text-default">{title}</p>
          <p className="body2-medium w-full truncate text-text-caption">
            {`${year} | ${publisher}`}
          </p>
        </div>

        {selected && (
          <span
            aria-hidden
            className="relative flex size-[2.8rem] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[rgba(255,255,255,0.47)] to-[rgba(255,255,255,0.19)] drop-shadow-[0_0_1.6rem_rgba(0,0,0,0.12)]"
          >
            <CheckIcon className="size-8 fill-icon-primary" />
          </span>
        )}
      </button>
    </li>
  );
};

import { SearchIcon } from '@/components';
import { BaseInput } from './BaseInput';

type Props = React.ComponentProps<'input'> & {
  onSearch?: () => void;
};

export const TextfieldSearch = (props: Props) => {
  const { onSearch, value, ...rest } = props;
  const hasValue = Boolean(String(value ?? '').trim());

  return (
    <div className="flex items-center gap-[2rem] py-[1.4rem] w-full relative">
      <BaseInput
        {...rest}
        value={value}
        placeholder="책 등록하기"
        className="text-text-default headline2-bold placeholder:text-text-caption placeholder:headline2-medium"
      />

      <button
        type="button"
        onClick={onSearch}
        className="flex items-center justify-center"
        disabled={!hasValue}
        aria-label="검색"
      >
        <SearchIcon
          className={`size-[3.6rem] ${hasValue ? 'fill-gray-900' : 'fill-icon-disabled'}`}
        />
      </button>
      <div className="absolute bottom-0 inset-x-0 h-[0.2rem] bg-gradient-line" />
    </div>
  );
};

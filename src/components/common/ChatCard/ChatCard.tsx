import { BookmarkCheckIcon, ReloadIcon } from '@/components';
import { cn } from '@/lib';
import {
  CHAT_CARD_STATUS,
  type ChatCardColor,
  chatCardIconColor,
  type ChatCardStatus,
  chatCardTitleColor,
  chatCardVariants,
} from './chatCardVariants';

export type ChatCardProps = {
  color?: ChatCardColor;
  status?: ChatCardStatus;
  bookmarked?: boolean;
  bookTitle?: string;
  date?: string;
  summary?: string;
  className?: string;
  onRefresh?: () => void;
};

export const ChatCard = (props: ChatCardProps) => {
  const {
    color = 'teal',
    status = CHAT_CARD_STATUS.DEFAULT,
    bookmarked = false,
    bookTitle,
    date,
    summary,
    className,
    onRefresh,
  } = props;

  const [isDefault, isLoading, isError] = [
    CHAT_CARD_STATUS.DEFAULT,
    CHAT_CARD_STATUS.LOADING,
    CHAT_CARD_STATUS.ERROR,
  ].map((s) => status === s);

  return (
    <article className={cn(chatCardVariants({ color }), className)}>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_32px_0px_rgba(255,255,255,0.65)]" />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {(isDefault || isLoading) && (bookTitle ?? date) && (
          <p className="body2-semibold line-clamp-1 w-full shrink-0 break-words tracking-[-0.042rem] text-[rgba(0,0,0,0.27)]">
            {bookTitle ?? date}
          </p>
        )}
        {isError && (
          <p className="body2-semibold shrink-0 tracking-[-0.042rem] text-[rgba(0,0,0,0.27)]">
            새로고침이 필요해요
          </p>
        )}

        {/* default: 요약 본문 */}
        {isDefault && (
          <p
            className={cn(
              'body1-bold line-clamp-2 w-full break-words tracking-[-0.064rem]',
              chatCardTitleColor[color],
            )}
          >
            {summary}
          </p>
        )}

        {/* loading: 텍스트 + 점 애니메이션 */}
        {isLoading && (
          <div className="flex shrink-0 items-center gap-[0.8rem]">
            <p className="body1-bold whitespace-nowrap tracking-[-0.064rem] text-[rgba(0,0,0,0.3)]">
              대화 내용을 요약하고 있어요
            </p>
            <div className="flex shrink-0 items-center gap-[0.3rem]">
              <span className="size-[0.5rem] animate-bounce rounded-full bg-[rgba(0,0,0,0.3)] [animation-delay:0ms]" />
              <span className="size-[0.5rem] animate-bounce rounded-full bg-[rgba(0,0,0,0.4)] [animation-delay:150ms]" />
              <span className="size-[0.5rem] animate-bounce rounded-full bg-[rgba(0,0,0,0.3)] [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* error: 오류 본문 */}
        {isError && (
          <p className="body1-bold tracking-[-0.064rem] text-[rgba(0,0,0,0.3)]">
            대화 내용을 불러올 수 없어요
          </p>
        )}
      </div>

      {isDefault && bookmarked && (
        <BookmarkCheckIcon color={color} className="relative shrink-0 size-[2.4rem]" />
      )}

      {isError && (
        <button
          type="button"
          aria-label="새로고침"
          onClick={(e) => {
            e.preventDefault();
            onRefresh?.();
          }}
          className="relative shrink-0 cursor-pointer"
        >
          <ReloadIcon className={cn('size-[2.4rem]', chatCardIconColor[color])} />
        </button>
      )}
    </article>
  );
};

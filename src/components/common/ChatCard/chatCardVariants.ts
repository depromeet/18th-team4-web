import { cva } from 'class-variance-authority';

export const CHAT_CARD_COLOR = {
  TEAL: 'teal',
  MAGENTA: 'magenta',
  YELLOW: 'yellow',
  SKY: 'sky',
  GREEN: 'green',
  PURPLE: 'purple',
  BLUE: 'blue',
} as const;

export const CHAT_CARD_STATUS = {
  DEFAULT: 'default',
  LOADING: 'loading',
  ERROR: 'error',
} as const;

export type ChatCardColor = (typeof CHAT_CARD_COLOR)[keyof typeof CHAT_CARD_COLOR];
export type ChatCardStatus = (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS];

export const chatCardBackgroundColor: Record<ChatCardColor, string> = {
  teal: 'bg-[rgba(213,239,236,0.8)]',
  magenta: 'bg-[rgba(255,232,244,0.8)]',
  yellow: 'bg-[rgba(246,242,200,0.8)]',
  sky: 'bg-[rgba(196,230,245,0.8)]',
  green: 'bg-[rgba(228,248,214,0.8)]',
  purple: 'bg-[rgba(224,225,252,0.8)]',
  blue: 'bg-[rgba(205,229,255,0.8)]',
};

export const chatCardVariants = cva(
  'relative flex items-start gap-[0.8rem] rounded-[1.4rem] px-[2.4rem] py-[1.8rem]',
  {
    variants: {
      color: chatCardBackgroundColor,
    },
    defaultVariants: {
      color: 'teal',
    },
  },
);

export const chatCardTitleColor: Record<ChatCardColor, string> = {
  teal: 'text-sub-teal',
  magenta: 'text-sub-magenta',
  yellow: 'text-sub-yellow',
  sky: 'text-sub-sky',
  green: 'text-sub-green',
  purple: 'text-sub-purple',
  blue: 'text-sub-blue',
};

export const chatCardIconColor: Record<ChatCardColor, string> = {
  teal: 'fill-sub-teal',
  magenta: 'fill-sub-magenta',
  yellow: 'fill-sub-yellow',
  sky: 'fill-sub-sky',
  green: 'fill-sub-green',
  purple: 'fill-sub-purple',
  blue: 'fill-sub-blue',
};

export const CHAT_CARD_COLOR_SEQUENCE: readonly ChatCardColor[] = [
  CHAT_CARD_COLOR.TEAL,
  CHAT_CARD_COLOR.PURPLE,
  CHAT_CARD_COLOR.GREEN,
  CHAT_CARD_COLOR.MAGENTA,
  CHAT_CARD_COLOR.BLUE,
  CHAT_CARD_COLOR.YELLOW,
  CHAT_CARD_COLOR.SKY,
];

/** 인덱스를 색상 시퀀스에 순환 매핑한다(목록에서 카드 색을 순서대로 배정할 때 사용). */
export const chatCardColorByIndex = (index: number): ChatCardColor =>
  CHAT_CARD_COLOR_SEQUENCE[index % CHAT_CARD_COLOR_SEQUENCE.length];

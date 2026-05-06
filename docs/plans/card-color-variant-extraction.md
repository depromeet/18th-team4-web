# Card Color Variant 분리 계획

## 1. 배경

현재 `ChatCard`는 `ChatCardColor`, `CHAT_CARD_COLOR`, 색상별 배경/텍스트/아이콘 class를 `src/components/common/ChatCard/chatCardVariants.ts`에 가지고 있다.

`SummaryCard`도 같은 카드 색상 체계를 사용해야 하지만, 단기 작업에서는 일정상 `ChatCardColor`를 그대로 가져다 쓴다. 다만 `SummaryCard`가 `ChatCard`의 하위 개념은 아니므로, 장기적으로는 색상 타입과 variant 정의를 더 공용 위치로 분리한다.

## 2. 단기 결정

- `SummaryCard`는 우선 `ChatCardColor`를 import해서 `color?: ChatCardColor` 형태로 받는다.
- 기본값은 현재 `SummaryCard` 배경과 같은 계열인 `green`으로 둔다.
- `SummaryCard`의 radius, border, shadow, padding 등 고유 스타일은 유지한다.
- 이 단계에서는 대규모 rename을 하지 않는다.

## 3. 장기 목표

`ChatCardColor`라는 컴포넌트 전용 이름을 제거하고, 여러 카드형 컴포넌트가 공유할 수 있는 공용 색상 variant로 분리한다.

예상 이름:

- `CARD_COLOR`
- `CardColor`
- `cardBackgroundColor`
- `cardTitleColor`
- `cardIconColor`

예상 위치:

- `src/components/common/Card/cardColorVariants.ts`
- 또는 `src/components/common/variants/cardColor.ts`

최종 위치는 실제로 색상 체계를 공유하는 컴포넌트가 `ChatCard`, `SummaryCard` 외에 더 생기는지 보고 결정한다.

## 4. 권장 구현 단계

### 4.1 공용 variant 파일 생성

공용 파일에 색상 상수, 타입, class map을 옮긴다.

```ts
export const CARD_COLOR = {
  TEAL: 'teal',
  MAGENTA: 'magenta',
  YELLOW: 'yellow',
  SKY: 'sky',
  GREEN: 'green',
  PURPLE: 'purple',
  BLUE: 'blue',
} as const;

export type CardColor = (typeof CARD_COLOR)[keyof typeof CARD_COLOR];

export const cardBackgroundColor: Record<CardColor, string> = {
  teal: 'bg-[rgba(213,239,236,0.8)]',
  magenta: 'bg-[rgba(255,232,244,0.8)]',
  yellow: 'bg-[rgba(246,242,200,0.8)]',
  sky: 'bg-[rgba(196,230,245,0.8)]',
  green: 'bg-[rgba(228,248,214,0.8)]',
  purple: 'bg-[rgba(224,225,252,0.8)]',
  blue: 'bg-[rgba(205,229,255,0.8)]',
};
```

### 4.2 ChatCard 마이그레이션

- `ChatCardProps.color?: CardColor`로 변경한다.
- `chatCardVariants`는 `cardBackgroundColor`를 기반으로 구성한다.
- `chatCardTitleColor`, `chatCardIconColor`는 각각 `cardTitleColor`, `cardIconColor`로 이동한다.

### 4.3 기존 API 호환 alias 유지

기존 사용처를 한 번에 모두 바꾸지 않기 위해 `ChatCard` export에는 alias를 임시 유지한다.

```ts
export const CHAT_CARD_COLOR = CARD_COLOR;
export type ChatCardColor = CardColor;
```

신규 코드에서는 `CARD_COLOR`, `CardColor`를 사용하고, 기존 `CHAT_CARD_COLOR`, `ChatCardColor`는 점진적으로 제거한다.

### 4.4 SummaryCard 마이그레이션

- `SummaryCardProps.color?: CardColor`로 변경한다.
- 배경은 `cardBackgroundColor[color]`를 사용한다.
- 기본값은 `CARD_COLOR.GREEN`으로 둔다.

## 5. 제거 조건

아래 조건을 만족하면 `CHAT_CARD_COLOR`, `ChatCardColor` alias를 제거한다.

- `rg "CHAT_CARD_COLOR|ChatCardColor" src` 결과가 `ChatCard` 내부 호환 export 외에는 없다.
- `SummaryCard`와 신규 카드 컴포넌트가 모두 `CARD_COLOR`, `CardColor`를 사용한다.
- Storybook 또는 주요 화면에서 기존 색상 variant가 동일하게 렌더링되는 것을 확인했다.

## 6. 검증

- `npm run build`
- `rg "CHAT_CARD_COLOR|ChatCardColor" src`
- `rg "CARD_COLOR|CardColor" src`

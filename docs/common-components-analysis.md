# Common 컴포넌트 코드 컨벤션 분석

> `src/components/common/` 내부 컴포넌트의 현재 구현 패턴을 정리한 문서.
> 기준일: 2026-06-03

## 0. 요약

현재 `common/`은 단순 표시 컴포넌트만 모아둔 폴더가 아니라, 여러 페이지에서 재사용되는 UI 단위와 작은 행동 단위를 함께 포함한다.

| 컴포넌트                   | 역할                              | `cva`         | 상태/Hook                           | Client  | Storybook | 외부 Props 타입    |
| -------------------------- | --------------------------------- | ------------- | ----------------------------------- | ------- | --------- | ------------------ |
| `BottomSheet`              | portal 기반 바텀시트/dialog       | -             | `useEffect`, `useSyncExternalStore` | ✅      | ✅        | -                  |
| `Button` / `LinkButton`    | 버튼과 링크형 버튼                | ✅            | -                                   | -       | ✅        | -                  |
| `ChatCard`                 | 요약 카드 상태 UI                 | ✅            | -                                   | -       | ✅        | ✅ `ChatCardProps` |
| `Empty`                    | 검색 결과 없음 표시               | -             | -                                   | -       | -         | -                  |
| `GrainyOverlay`            | SVG noise overlay                 | -             | `useId`                             | -       | -         | -                  |
| `Header`                   | 페이지 상단바                     | ✅            | DOM query, timer                    | -       | -         | -                  |
| `Icon/*`                   | SVG wrapper                       | 일부 직접 SVG | 일부 `useId`                        | -       | -         | -                  |
| `ListItem`                 | 책 선택 리스트 항목               | ✅            | `useState`                          | ✅      | ✅        | -                  |
| `Loading`                  | wave loading 표시                 | -             | -                                   | -       | ✅        | -                  |
| `TextfieldChat`            | 채팅 입력창                       | ✅ 3개        | keyboard handler                    | -       | ✅        | -                  |
| `TextfieldSearch`          | 검색 입력창                       | -             | controlled value 판단               | -       | ✅        | -                  |
| `Toast` / `ToastContainer` | toast item과 store 기반 container | ✅ 2개        | `useEffect`, Zustand store          | 일부 ✅ | -         | -                  |
| `Tooltip`                  | 말풍선/coachmark                  | ✅ 2개        | -                                   | -       | ✅        | ✅ `TooltipProps`  |

## 1. 현재 공통 패턴

### 1.1 컴포넌트 선언

- 대부분 `const Component = (props: Props) => { ... }` 형태의 named export를 사용한다.
- props는 함수 파라미터에서 바로 구조분해하지 않고 본문에서 구조분해한다.
- `React.FC`와 `function Component()` 선언은 사용하지 않는다.
- 예외적으로 `BaseInput`은 ref 전달이 필요해 `React.forwardRef`를 사용하고 `displayName`을 명시한다.

```tsx
export const Button = (props: Props) => {
  const { variant, size, className, ...rest } = props;

  return <button className={cn(buttonVariants({ variant, size, className }))} {...rest} />;
};
```

### 1.2 Props 타입

- `interface` 대신 `type`을 사용한다.
- 외부에 노출하지 않는 props는 대체로 `Props`라는 로컬 이름을 쓴다.
- 외부 조합에 필요한 props만 `[ComponentName]Props`로 export한다.
  - 현재 사례: `ChatCardProps`, `TooltipProps`
- native element props가 필요한 컴포넌트는 `React.ComponentProps<'tag'>`를 확장한다.
- variant 타입은 `VariantProps<typeof xxxVariants>`를 붙여 `cva` 정의와 연결한다.

```tsx
type Props = Omit<React.ComponentProps<'input'>, 'disabled'> &
  VariantProps<typeof containerVariants> & {
    onSend?: () => void;
  };
```

### 1.3 Styling

- 클래스 병합은 `cn(...)`을 사용한다.
- `cva`를 쓰는 컴포넌트는 `variants.ts`에 스타일 결정을 분리하고 컴포넌트에서는 상태 계산과 렌더링에 집중한다.
- `cn` import 경로는 아직 혼재한다.
  - `@/lib`: 다수 컴포넌트
  - `@/lib/utils`: `LinkButton`, 일부 `Icon`

### 1.4 Barrel export

- `src/components/common/index.ts`가 모든 common 컴포넌트를 export한다.
- `src/components/index.ts`는 `common`과 `pages`를 다시 export한다.
- 스토리와 컴포넌트 내부 import는 상대 경로와 `@/components` barrel 경로가 혼재한다.

## 2. Variant 패턴

### 2.1 `as const` 객체를 쓰는 패턴

`Button`, `Header`, `ChatCard`, 채팅 입력 상태 상수는 enum-like 값을 `as const` 객체로 선언한다.

```ts
export const CHAT_CARD_STATUS = {
  DEFAULT: 'default',
  LOADING: 'loading',
  ERROR: 'error',
} as const;

export type ChatCardStatus = (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS];
```

장점:

- 호출부에서 `CHAT_CARD_STATUS.ERROR`처럼 자동완성을 받을 수 있다.
- 문자열 오타를 줄인다.
- 여러 파일에서 같은 상태 값을 공유하기 쉽다.

### 2.2 union type만 쓰는 패턴

옵션 수가 작거나 외부 상수 호출 필요가 적은 경우 union type만 사용한다.

- `ButtonSize = 'sm' | 'md' | 'lg' | 'full'`
- `TooltipArrowSide = 'top' | 'bottom'`
- `TooltipArrowAlignment = 'left' | 'middle' | 'right'`
- `ToastType = 'error'`

### 2.3 `cva` 분리 기준

현재 `cva` 사용 사례는 다음과 같다.

| 파일                                 | `cva` 수 | 기준                          |
| ------------------------------------ | -------: | ----------------------------- |
| `Button/buttonVariants.ts`           |        1 | `variant`, `size`             |
| `Header/headerVariants.ts`           |        1 | `variant`별 layout            |
| `ChatCard/chatCardVariants.ts`       |        1 | 카드 배경 색                  |
| `ListItem/listItemVariants.ts`       |        1 | `selected` 상태               |
| `Textfield/textfieldChatVariants.ts` |        3 | container, input, send button |
| `Toast/toastVariants.ts`             |        2 | glow, icon                    |
| `Tooltip/tooltipVariants.ts`         |        2 | body, arrow                   |

한 컴포넌트 안에서도 스타일 책임이 시각적으로 분리되면 `cva`를 여러 개로 나눈다. `TextfieldChat`, `Toast`, `Tooltip`이 현재 사례다.

## 3. 컴포넌트별 분석

### 3.1 BottomSheet

구조:

```txt
BottomSheet/
├── BottomSheet.tsx
├── BottomSheet.stories.tsx
└── index.ts
```

특징:

- `use client` 컴포넌트다.
- `createPortal(..., document.body)`로 body에 렌더링한다.
- `useSyncExternalStore`로 mounted 여부를 확인해 SSR hydration 차이를 피한다.
- open 상태에서 body scroll을 잠그고, Escape 입력으로 `onClose`를 호출한다.
- overlay는 button으로 구현해 클릭 닫기를 제공한다.
- `aside`에 `role="dialog"`와 `aria-modal`을 지정한다.
- `max-height` transition 종료 시 `onMaxHeightTransitionEnd(open)`을 호출한다.

검토할 점:

- dialog의 accessible name은 현재 `aria-label="책 선택"`으로 고정되어 있다. 다른 용도로 재사용하려면 label prop이 필요하다.
- portal과 body scroll lock을 포함하므로 단순 layout primitive가 아니라 interaction primitive로 취급해야 한다.

### 3.2 Button / LinkButton

구조:

```txt
Button/
├── Button.tsx
├── LinkButton.tsx
├── buttonVariants.ts
├── Button.stories.tsx
└── index.ts
```

특징:

- `<button>`과 `next/link` 기반 `<Link>`가 같은 `buttonVariants`를 공유한다.
- `LinkButton`은 `disabled` prop을 별도로 받고 `aria-disabled`, `tabIndex=-1`, `preventDefault`, disabled style을 적용한다.
- `BUTTON_VARIANT`는 `as const` 객체지만 `ButtonSize`는 union type이다.
- `Button`은 `@/lib`, `LinkButton`은 `@/lib/utils`에서 `cn`을 가져온다.

### 3.3 ChatCard

구조:

```txt
ChatCard/
├── ChatCard.tsx
├── chatCardVariants.ts
├── ChatCard.stories.tsx
└── index.ts
```

특징:

- `color`와 `status`를 독립 props로 받는다.
- 상태는 `default`, `loading`, `error` 세 가지다.
- `default` 상태에서는 날짜, 요약, bookmark icon을 표시한다.
- `loading` 상태에서는 텍스트와 bounce dot animation을 표시한다.
- `error` 상태에서는 reload button을 표시하고 click event에서 `preventDefault()` 후 `onRefresh`를 호출한다.
- `ChatCardProps`, `ChatCardColor`, `ChatCardStatus`, 색상 map, 색상 sequence를 export한다.

검토할 점:

- `status`에 따라 필요한 prop이 달라진다. 예를 들어 `default`에는 `summary`, `error`에는 `onRefresh`가 의미 있다. 현재는 모두 optional이라 잘못된 조합을 타입으로 막지 않는다.

### 3.4 Empty

특징:

- `common/Empty/index.tsx` 단일 파일이다.
- 검색 결과 없음 문구와 `DialogIcon`이 고정되어 있다.
- props가 없으므로 재사용 범위는 “책 검색 결과 없음”에 가깝다.

검토할 점:

- 다른 empty state로 재사용할 계획이 있으면 `title`, `description`, `icon` prop으로 열어야 한다.
- 현재처럼 특정 문구가 고정되어 있으면 `pages/Register` 하위 도메인 컴포넌트로 옮기는 것도 선택지다.

### 3.5 GrainyOverlay

특징:

- SVG filter overlay를 렌더링한다.
- `useId`로 filter id 충돌을 피한다.
- `opacity`만 prop으로 열려 있다.
- `aria-hidden`과 `pointer-events-none`으로 장식 요소임을 명확히 한다.

### 3.6 Header

구조:

```txt
Header/
├── Header.tsx
├── headerVariants.ts
└── index.ts
```

특징:

- `HEADER_VARIANT`는 `home`, `back`, `chat` 세 가지다.
- variant가 단순 스타일뿐 아니라 렌더링 구조를 바꾼다.
- `home`: logo와 책 등록 링크를 표시한다.
- `back`, `chat`: 뒤로가기 button을 표시한다.
- `chat`: `summarizeActive`가 true일 때 요약 button을 활성화하고 Tooltip을 표시한다.
- 뒤로가기 시 `[data-page-transition]` DOM을 찾아 slide-out class를 붙이고 280ms 후 `onBack`을 호출한다.

검토할 점:

- Header가 navigation UI뿐 아니라 page transition orchestration까지 담당한다.
- `document.querySelector`와 duration 상수가 Header 내부에 있으므로 전환 방식이 바뀌면 Header도 함께 수정해야 한다.
- Storybook이 없다.

### 3.7 Icon

구조:

```txt
Icon/
├── ArrowIcon.tsx
├── BookmarkCheckIcon.tsx
├── ...
└── index.ts
```

특징:

- 대부분 asset SVG를 감싼 얇은 wrapper다.
- 기본 size/fill/text class를 부여하고 `className`으로 override를 받는다.
- 일부 아이콘은 `SVGProps<SVGSVGElement>` 전체를 받는다.
- `BookmarkCheckIcon`은 직접 SVG를 그리고 `ChatCardColor`별 gradient/filter 설정을 가진다.
- `BookmarkCheckIcon`, `GrainyOverlay`처럼 SVG id 충돌 위험이 있는 컴포넌트는 `useId`를 사용한다.

검토할 점:

- `Props = { className?: string }`인 아이콘과 `SVGProps<SVGSVGElement>`인 아이콘이 섞여 있다.
- `cn` import 경로가 `@/lib`와 `@/lib/utils`로 섞여 있다.

### 3.8 ListItem

구조:

```txt
ListItem/
├── ListItem.tsx
├── listItemVariants.ts
├── ListItem.stories.tsx
└── index.ts
```

특징:

- `use client` 컴포넌트다.
- 루트는 `<li>`이고 내부 click target은 `<button>`이다.
- `selected` 상태를 `aria-pressed`와 배경색으로 표현한다.
- thumbnail은 별도 내부 컴포넌트 `ListItemThumb`로 분리되어 있다.
- 이미지 URL trim 결과를 key로 사용해 src 변경 시 이미지 로드 실패 상태를 초기화한다.
- 이미지 src가 비었거나 로드 실패 시 `BookCoverPlaceholder`를 표시한다.

검토할 점:

- `year`와 `publisher` 기본값이 UI placeholder 성격이다. 실제 데이터 누락과 placeholder 표시를 구분할 필요가 있으면 props 설계를 조정해야 한다.

### 3.9 Loading

특징:

- `common/Loading/index.tsx` 단일 파일이다.
- `aria-busy="true"`와 `aria-label="로딩 중"`을 제공한다.
- 실제 animation class는 global style의 `loading-wave` 계열에 의존한다.

### 3.10 Textfield

구조:

```txt
Textfield/
├── BaseInput.tsx
├── TextfieldChat.tsx
├── TextfieldSearch.tsx
├── textfieldChatVariants.ts
├── TextfieldChat.stories.tsx
├── TextfieldSearch.stories.tsx
└── index.ts
```

`BaseInput`:

- `React.forwardRef`를 사용하는 input primitive다.
- 공통 input class와 외부 `className`을 병합한다.

`TextfieldChat`:

- `status`와 `bgVariant`에 따라 container, input, send button style을 나눈다.
- `CHAT_PLACEHOLDER`에서 status별 placeholder를 가져온다.
- `disabled`, `error`, `loading` 상태에서는 input과 send button을 disabled 처리한다.
- Enter 입력 시 `onSend`를 호출하되 `e.nativeEvent.isComposing`이면 호출하지 않는다.
- loading 상태에서는 `aria-busy`와 spinner를 표시한다.
- native `disabled` prop은 `Omit`으로 막고 status에서만 disabled 여부를 결정한다.

`TextfieldSearch`:

- controlled `value`를 기준으로 검색 button 활성화 여부를 계산한다.
- 값이 공백뿐이면 disabled 처리한다.
- 검색 아이콘 색상은 `hasValue`에 따라 바뀐다.

검토할 점:

- `TextfieldSearch`는 className 문자열 결합을 template literal로 처리한다. 다른 컴포넌트처럼 `cn`을 쓰면 일관성이 좋아진다.
- `BaseInput`은 `@/components` barrel에서 export되며 `TextfieldChat`도 barrel import로 가져온다. 같은 폴더 내부 import와 barrel import가 혼재한다.

### 3.11 Toast

구조:

```txt
Toast/
├── Toast.tsx
├── ToastContainer.tsx
├── toastVariants.ts
└── index.ts
```

특징:

- `Toast`는 표시 컴포넌트고 `ToastContainer`는 store 구독과 timer 관리를 담당한다.
- 현재 toast type은 `error` 하나뿐이다.
- `TOAST_ICON`, `TOAST_ROLE`을 `Record<ToastType, ...>`로 선언해 타입 추가 시 누락을 잡기 쉽다.
- error toast는 `role="alert"`를 사용한다.
- `ToastContainer`는 `useToastStore`에서 toasts를 가져오고, 각 toast마다 `ToastTimer`를 붙여 duration 후 dismiss한다.

검토할 점:

- Storybook이 없다.
- `ToastType`이 늘어나면 `toastVariants`, `TOAST_ICON`, `TOAST_ROLE`을 함께 갱신해야 한다.

### 3.12 Tooltip

구조:

```txt
Tooltip/
├── Tooltip.tsx
├── tooltipVariants.ts
├── Tooltip.stories.tsx
└── index.ts
```

특징:

- `TooltipProps`를 export한다.
- `Omit<React.ComponentProps<'div'>, 'children' | 'className'>`으로 children과 className을 의도적으로 막는다.
- 내용은 `content: React.ReactNode`로 강제한다.
- body와 arrow의 `cva`를 분리한다.
- 기본 role은 `tooltip`이고 외부 override가 가능하다.
- arrow SVG에는 `aria-hidden="true"`를 지정한다.

검토할 점:

- `className`을 막았기 때문에 container 위치나 색상 조정은 variants 확장 없이는 어렵다.
- arrow 쪽만 `arrowClassName`을 열어둔 설계가 의도인지 유지 확인이 필요하다.

## 4. Storybook 현황

Storybook이 있는 common 컴포넌트:

- `BottomSheet`
- `Button`
- `ChatCard`
- `ListItem`
- `Loading`
- `TextfieldChat`
- `TextfieldSearch`
- `Tooltip`

Storybook이 없는 common 컴포넌트:

- `Empty`
- `GrainyOverlay`
- `Header`
- `Icon`
- `Toast`

공통 패턴:

- `@storybook/nextjs-vite`의 `Meta`, `StoryObj` 사용
- `tags: ['autodocs']`
- 대부분 `parameters.layout: 'centered'`
- interaction callback은 `storybook/test`의 `fn()` 사용

일관성 이슈:

- import 경로가 상대 경로와 `@/components` barrel로 섞여 있다.
- `BottomSheet`만 `layout: 'fullscreen'`을 사용한다. 컴포넌트 특성상 적절하다.
- `Header`, `Toast`처럼 상태/접근성 확인이 중요한 컴포넌트의 story가 없다.

## 5. 접근성 패턴

현재 잘 반영된 부분:

- `BottomSheet`: `role="dialog"`, `aria-modal`, overlay button label, Escape close
- `Button`/`LinkButton`: link disabled 시 `aria-disabled`, tab 제외
- `Header`: icon button에 `aria-label`
- `ListItem`: 선택 상태를 `aria-pressed`로 표현
- `Loading`: `aria-busy`, `aria-label`
- `TextfieldChat`: loading 상태에서 `aria-busy`, send button label 변경
- `Toast`: error type에 `role="alert"`
- `Tooltip`: 기본 `role="tooltip"`, arrow `aria-hidden`

추가 검토가 필요한 부분:

- `BottomSheet`는 focus trap과 initial focus 처리가 없다.
- `Header`의 Tooltip은 표시되지만 trigger와 `aria-describedby` 연결은 Header 내부에서 하지 않는다.
- `Empty`는 고정 문구라 재사용 컴포넌트로 볼 때 accessible name 확장성이 낮다.

## 6. 일관성 이슈

| 이슈                     | 현재 상태                          | 제안                                                       |
| ------------------------ | ---------------------------------- | ---------------------------------------------------------- |
| `cn` import 경로         | `@/lib`, `@/lib/utils` 혼재        | 하나로 통일                                                |
| Storybook import         | 상대 경로, barrel 혼재             | 컴포넌트 story는 상대 경로 우선 권장                       |
| Props type export        | `ChatCard`, `Tooltip`만 export     | 외부 조합에 필요한 경우만 `[Component]Props` export 유지   |
| icon props               | `className` 전용과 `SVGProps` 혼재 | 새 아이콘은 `SVGProps<SVGSVGElement>` 우선 검토            |
| variant 상수             | `as const`와 union 혼재            | 외부 호출부에서 재사용하면 `as const`, 내부 전용이면 union |
| client boundary          | 일부 컴포넌트만 `use client`       | hook/DOM API 필요 시 파일 상단에 명시                      |
| component responsibility | Header, BottomSheet가 행동 포함    | 행동 포함 컴포넌트는 Storybook과 접근성 검증 강화          |

## 7. 유지보수 기준

새 common 컴포넌트를 추가할 때:

- 여러 페이지에서 재사용되거나 공통 UI primitive로 볼 수 있을 때만 `common/`에 둔다.
- 특정 도메인 문구와 데이터 구조에 묶이면 `pages/<Page>/`에 먼저 둔다.
- variant가 2개 이상이거나 상태별 class가 늘어나면 `*Variants.ts` 분리를 검토한다.
- 외부에서 조합할 props 타입이 필요할 때만 `[ComponentName]Props`로 export한다.
- DOM API, effect, local state가 필요하면 `use client`를 명시하고 접근성 동작을 함께 확인한다.
- Storybook은 상태 조합, disabled/loading/error, 접근성 label이 있는 컴포넌트에 우선 추가한다.

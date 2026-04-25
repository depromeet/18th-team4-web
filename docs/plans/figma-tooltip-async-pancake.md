# Tooltip 공통 컴포넌트 구현 계획

## Context

readum-web 프로젝트에 Figma 디자인(node `673:10619`)의 Tooltip 공통 컴포넌트가 아직 없어 신규 구현이 필요하다. Figma 디자인은 트리거 아래로 떨어지는 단방향(top arrow) dark bubble이며, 화살표 정렬만 `left | middle | right` 3종으로 갈린다. 1차 사용 시나리오는 onboarding 코치마크처럼 "페이지가 직접 띄움".

목적:

- 디자인을 픽셀에 맞게 구현하면서 프로젝트 컨벤션(Tailwind v4 CSS-first, cva, named export, type 우선, RSC 호환)을 따른다.
- 1단계는 시각 표현만 담당하는 **Presentational-only** 컴포넌트로 출시 — `'use client'` 없이 RSC에서 import 가능. hover/click trigger는 후속 PR로 분리.
- Figma의 `Gray 800: #222726`이 프로젝트 `--color-gray-800: #302f2f`와 다른 문제는 **별도 PR에서 디자인 시스템 값 sync 작업이 진행 중**이므로 본 PR은 신경 쓰지 않고 기존 `bg-gray-800` 유틸리티를 그대로 사용한다. sync PR이 머지되면 자동으로 Figma 값이 반영된다.

비목적 (이번 PR에 포함하지 않음):

- hover/click/focus trigger, `useTooltip` 훅, `HoverTooltip` wrapper.
- Tooltip placement 4방향 확장 (현재는 Tooltip이 트리거 아래에 놓이는 코치마크 형태만 다룸).
- Floating UI / Radix / Portal 도입.
- Vitest 테스트 — 시각 검증과 접근성 패널 확인은 Storybook + addon-a11y에서 수행.

---

## 디자인 사양 (Figma node 673:10619)

| 항목            | 값                                                                   |
| --------------- | -------------------------------------------------------------------- |
| 컴포넌트 width  | `178px` (Figma 인스턴스 한정 — 공통 컴포넌트 base에는 미반영)        |
| 본체 배경       | `Palette/Gray/Gray 800` = `#222726`                                  |
| 본체 padding    | `10px 12px` (상하 10, 좌우 12)                                       |
| 본체 radius     | `10px`                                                               |
| 텍스트 색       | `#ffffff`                                                            |
| 텍스트 정렬     | `center`                                                             |
| 텍스트 줄바꿈   | `whitespace-nowrap`                                                  |
| 폰트            | `Body2/bold` = SUIT Bold 14 / 1.5 / letter-spacing `-3%` (`-0.42px`) |
| 화살표          | `41 × 8`, 위쪽 (트리거가 Tooltip 위에 있음)                          |
| arrow alignment | `left` / `middle` / `right` 3종                                      |
| 예시 메시지     | "이제 대화를 요약할 수 있어요"                                       |

---

## 핵심 의사결정 (사용자 확정)

| 항목          | 결정                                                                             | 사유                                                                            |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 컴포넌트 형태 | **Presentational-only** (`<Tooltip content arrowSide arrowAlignment />`)         | 코치마크 사용처가 1차. open 제어는 사용처가 가짐. RSC 호환.                     |
| 포지셔닝      | **정적 CSS** (`absolute top-full mt-2` 등은 사용처 className)                    | 디자인이 단방향. flip 미정의. 의존성 0.                                         |
| 화살표        | **Inline SVG** (`fill="currentColor"`)                                           | 토큰 일관성, asset 추가 없음. Figma MCP 접근 가능 환경에서 path 정확 추출.      |
| 색상 토큰     | **기존 `bg-gray-800` 그대로 사용**, `global.css` 변경 없음                       | 디자인 시스템 값 sync는 별도 PR에서 진행 중. 본 PR은 토큰 정의에 손대지 않는다. |
| Width         | **base에 width 없음** (`inline-block whitespace-nowrap`만)                       | 메시지 길이에 따라 사용처가 결정. 재사용성 우선.                                |
| RSC 경계      | Tooltip 본체 **`'use client'` 없음**                                             | Next 16 가이드의 "boundary는 leaf" 원칙.                                        |
| 접근성        | `role="tooltip"`, `id` prop은 사용처가 부여 → 트리거에서 `aria-describedby={id}` | RSC 유지(`useId()`를 본 컴포넌트에서 호출하지 않음).                            |
| 검증          | **Storybook + addon-a11y**                                                       | Vitest 테스트 미작성. 시각 검증과 접근성 패널 확인은 Storybook에서.             |

---

## API 시그니처

```ts
type TooltipArrowSide = 'top'; // 화살표가 Tooltip 본체의 위쪽에 있음. Tooltip은 트리거 아래에 배치됨.
type TooltipArrowAlignment = 'left' | 'middle' | 'right';

type TooltipProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof tooltipVariants> & {
    className?: string;
    arrowClassName?: string; // 배경색 override 시 화살표 색도 함께 맞추기 위한 escape hatch.
    content: React.ReactNode; // 본문. children 미사용.
    arrowSide?: TooltipArrowSide; // 기본 'top'
    arrowAlignment?: TooltipArrowAlignment; // 기본 'middle'
  };
```

설계 메모:

- `content` 단일 prop으로 받음 (`children` 사용 X). 사용처가 위치/너비를 `className`(`absolute top-full mt-2 w-[178px] …`)으로 처리한다.
- `ComponentProps<'div'>`는 기본적으로 `children`을 포함하므로 `Omit<..., 'children'>`으로 막아 API 의도와 타입을 일치시킨다.
- `placement`라는 이름은 일반적으로 Tooltip이 트리거의 어느 방향에 놓이는지를 뜻하므로 이번 컴포넌트에는 쓰지 않는다. 현재 디자인은 "Tooltip은 트리거 아래, 화살표는 본체 위쪽"이므로 `arrowSide="top"`으로 표현한다.
- `id` 등 native `div` 속성은 `ComponentProps<'div'>`로 자동 노출 → `<Tooltip id="onboard-tip-1" …>` 가능, 트리거에 `aria-describedby="onboard-tip-1"`.
- 기본 화살표 색상은 본체 배경 토큰과 같은 `text-gray-800`이다. `className`으로 `bg-negative` 같은 배경색을 override하는 경우 `arrowClassName="text-negative"`도 같이 넘겨 본체와 화살표 색을 맞춘다.

---

## 파일 변경 (실제 수정/생성 목록)

### 신규

1. `src/components/common/Tooltip/tooltipVariants.ts` — `cva`로 본체 + 화살표 variants.
2. `src/components/common/Tooltip/Tooltip.tsx` — Presentational 컴포넌트, `role="tooltip"`, inline SVG 화살표.
3. `src/components/common/Tooltip/index.ts` — named re-export.
4. `src/stories/Tooltip.stories.ts` — `Default`, `ArrowLeft/Middle/Right`, `LongContent`, `Coachmark` 시나리오.

### 수정

5. `src/components/common/index.ts` — `export * from './Tooltip';` 추가.

> `src/style/global.css`는 손대지 않는다 — 디자인 시스템 값 sync는 별도 PR에서 처리.

---

## 구현 노트

### `tooltipVariants.ts`

본체 base 클래스(예시):

```
body2-bold relative inline-block whitespace-nowrap rounded-[10px] bg-gray-800 px-3 py-[10px] text-center text-gray-white tracking-[-0.03em]
```

- `body2-bold` utility는 14px / 1.5 / 700 커버 (`global.css:137-140`). letter-spacing `-0.42px / 14 = -0.03em`은 utility에 없으므로 `tracking-[-0.03em]`로 보강.
- `px-3` = 12px. Tailwind 기본 spacing scale 일치.
- `bg-gray-800`은 기존 토큰. 디자인 시스템 sync PR이 머지되면 `#302f2f → #222726`로 자동 갱신되어 Figma 값과 일치.

화살표 wrapper variants(예시):

```ts
{
  arrowSide: { top: '-top-[8px]' },
  arrowAlignment: {
    left: 'left-3',
    middle: 'left-1/2 -translate-x-1/2',
    right: 'right-3',
  },
}
```

- 화살표 wrapper의 색상은 `text-gray-800` (currentColor가 따라감) — 본체 `text-gray-white`(흰색)와 분리되도록 별도 클래스 부여.
- 배경색을 override하는 사용처는 `arrowClassName`으로 화살표 색도 함께 override한다. 예: `className="bg-negative" arrowClassName="text-negative"`.
- 사이즈: `h-[8px] w-[41px]` (Figma 41×8).

### `Tooltip.tsx`

- `'use client'` 없음.
- `import { cn } from '@/lib';` (Button.tsx와 spec 04 예시 일치).
- `import { type VariantProps } from 'class-variance-authority';` (인라인 type, spec 11).
- arrow function + named `export const Tooltip`.
- 화살표 SVG: `viewBox="0 0 41 8"`, `<path fill="currentColor" d="..." />`.
- **화살표 path는 Figma MCP 접근이 가능한 구현 환경에서 `get_design_context`로 node 673:10619를 재호출하여 실제 path 추출**. Plan 단계에서는 placeholder를 두지만, 비대칭 디자인일 가능성이 있으므로 정확한 path를 Figma에서 옮겨와야 픽셀 정합성 확보.

### Storybook 스토리

- `satisfies Meta<typeof Tooltip>` 패턴 (`src/stories/Button.stories.ts`의 형태만 참고. 해당 파일은 Storybook 샘플 컴포넌트를 import함).
- 시나리오:
  - `Default` (middle, 기본 메시지 "이제 대화를 요약할 수 있어요").
  - `ArrowLeft`, `ArrowMiddle`, `ArrowRight` — 3종 정렬 시각 검증.
  - `LongContent` — 긴 한국어 메시지 + `whitespace-nowrap` 동작 확인.
  - `WithCustomClassName` — 사용처가 `w-[178px]` 같은 layout class를 override 가능한지.
  - `WithCustomColor` — `className="bg-negative"`와 `arrowClassName="text-negative"`를 함께 넘겨 본체/화살표 색 override가 어긋나지 않는지.
  - `Coachmark` — decorator로 `relative` 부모 + 트리거 버튼 + `absolute top-full mt-2 w-[178px]` Tooltip 배치(Figma 인스턴스 재현).
- `.storybook/preview.ts`의 현재 `a11y.test`는 `todo`라서 CI를 실패시키지 않는다. `addon-a11y` 패널에서 role/contrast 위반을 수동 확인하고, CI 실패까지 요구하려면 별도 PR에서 `a11y.test: 'error'` 전환을 논의한다.

---

## 재사용 / 참고 파일

- 패턴 모델: `src/components/common/Button/Button.tsx`, `buttonVariants.ts`, `index.ts`.
- 클래스 병합 유틸: `src/lib/utils.ts` 의 `cn` (`@/lib` re-export).
- Storybook 모델: `src/stories/Button.stories.ts`는 Storybook 샘플 컴포넌트(`src/stories/Button.tsx`)를 import하므로 `satisfies Meta<typeof ...>` 형태만 참고한다. Tooltip story는 실제 공통 컴포넌트인 `@/components` 또는 `@/components/common/Tooltip`에서 import한다. `.storybook/preview.ts`는 `@/style/global.css` 로드와 `addon-a11y` 설정 확인용으로 참고한다.
- 토큰 정의: `src/style/global.css` `@theme` 블록 (body2 size/leading, gray-white, body2-bold utility).
- 컨벤션 출처: `docs/specs/04-components.md`, `09-styling.md`, `11-coding-conventions.md`, `13-testing.md`.

---

## 검증 (end-to-end)

1. **Storybook**:
   - 프로젝트 패키지 매니저 명령으로 storybook을 띄운 뒤, `Common/Tooltip` 카테고리에서 `Default`, `ArrowLeft`, `ArrowMiddle`, `ArrowRight`, `Coachmark` 시각 검증.
   - 현재 설정은 `a11y.test: 'todo'`이므로 CI 실패가 아니라 패널 표시 중심이다. `addon-a11y` 패널에서 contrast / role 위반 0건을 수동 확인한다.
2. **빌드 / 타입**:
   - `pnpm build` 또는 `tsc --noEmit`으로 RSC import 타입 오류 없는지 확인.
   - `src/app/page.tsx` 등 server component에서 `import { Tooltip } from '@/components/common/Tooltip'`가 use-client 경고 없이 동작하는지 sanity check.
3. **Figma 정합성**:
   - Figma MCP 접근이 가능한 환경에서 화살표 SVG path가 Figma export와 일치하는지 시각 비교한다. `get_design_context`로 node 673:10619 재호출하여 path d 검증.
   - 본체 padding/radius/font weight/letter-spacing이 Figma 사양과 일치하는지 확인.

---

## 후속 PR (이번 PR 이후)

1. **인터랙션 wrapping**: `src/hooks/useTooltip.ts`(`'use client'`, open + delay + outside-click) + `src/components/common/Tooltip/HoverTooltip.tsx`(`'use client'`, `cloneElement`로 트리거 binding).
2. **Tooltip placement 확장**: Tooltip이 트리거의 위/좌/우에 놓이는 디자인이 정해지면 별도 `placement` API와 cva variant 추가, 필요 시 Floating UI 도입 검토(PR 사유 명시).
3. **디자인 시스템 sync**: 별도 PR로 진행 중. 머지되면 `bg-gray-800`이 자동으로 Figma `#222726` 값을 반영한다.

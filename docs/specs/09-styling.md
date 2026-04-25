# 09. Styling — Tailwind v4

Tailwind v4는 **CSS-first 설정 방식**을 사용합니다. JS/TS 설정 파일이 아닌 CSS의 `@theme` 블록에서 토큰을 정의합니다.

## 위치

```
src/style/
└── global.css
```

## 핵심 규칙

- ❌ **`tailwind.config.ts` 생성 또는 수정 금지** — Tailwind v4는 더 이상 JS config를 사용하지 않습니다.
- ✅ 커스텀 디자인 토큰(색상, 폰트, spacing 등)은 `src/style/`의 CSS 파일에서 `@theme` 블록으로 정의합니다.
- ✅ Tailwind 클래스 순서는 Prettier가 자동 정렬합니다 (저장 시 자동 적용).

## 토큰 정의 예시

```css
/* src/style/theme.css */
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --font-sans: "Pretendard", sans-serif;
}
```

## `cn` 사용

`cn`은 `class-variance-authority` 결과나 조건부 클래스 결합을 위해 자주 쓰입니다.
공통 컴포넌트(`components/common/`)에서는 `cn` 사용을 **필수**로 권장합니다. → [04-components.md](./04-components.md#button--cva-예시)

```tsx
import { cn } from '@/lib';

<div className={cn('size-8 cursor-pointer fill-black', className)} />
```

## 인라인 스타일 / 외부 CSS 파일

- 인라인 스타일은 동적으로 계산되는 색상/사이즈처럼 Tailwind로 표현이 어려운 경우에만 허용.
- `*.module.css` / 컴포넌트별 CSS 파일 신규 생성 금지 — 모든 스타일은 Tailwind 유틸리티로 표현하고, 토큰 부족 시 `@theme`을 확장합니다.

# 05. Assets (`src/assets/`)

이미지/아이콘/폰트/추후 추가될 PDF·MP4 등 정적 에셋을 통합 관리합니다.

```
assets/
├── common/             # 어디서든 쓰이는 공통 에셋
│   ├── images/
│   ├── svgs/
│   │   ├── ic_*.svg
│   │   └── index.ts
│   └── index.ts
├── pages/              # 페이지 전용 에셋
└── index.ts
```

## 파일 포맷 규칙

| 종류 | 포맷 | 제약 |
| --- | --- | --- |
| 아이콘 | **SVG** | 50KB 이하 |
| 이미지 | **WEBP** | quality 90% 고정, resolution 최대 500KB (가장 높은 배율 선택) |

### WEBP 추출

피그마 개발 모드의 플러그인(`webp exporter`)으로 추출합니다.
quality 90%, 500KB 상한선을 기준으로 가장 높은 배율의 이미지를 선택합니다.

## SVG 네이밍 & Export

- 파일명: **`ic_` 접두어 + snake_case** (예: `ic_close.svg`, `ic_arrow_right.svg`)
- export 시: **`ic_` 제거 + Pascal Case**

```ts
// assets/common/svgs/index.ts
export { default as File } from './ic_file.svg';
export { default as Globe } from './ic_globe.svg';
export { default as Close } from './ic_close.svg';
```

## 색상/크기 변형은 단일 SVG로 처리

`arrow`, `chevron` 같은 아이콘을 색깔/크기별로 매번 새로 import 하는 것은 **금지**합니다.
SVG의 `fill`을 `currentColor`로 바꿔 한 파일로 재사용합니다.

### 변환 절차

1. SVG를 텍스트 에디터로 열기
2. `fill="..."` → `fill="currentColor"`로 수정

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd"
        d="M6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4874 18.0732 17.0126 18.0732 16.7197 17.7803L6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967Z"
        fill="currentColor" />
</svg>
```

3. 사용처에서 `text-*` / `fill-*` Tailwind 유틸리티로 색상 지정, `size-*` / `rotate-*`로 크기·방향 지정

```tsx
import { Close } from '@/assets';
import { cn } from '@/lib';

type Props = {
  className?: string;
  onClick?: () => void;
};

export const CloseIcon = ({ className, onClick }: Props) => {
  return <Close onClick={onClick} className={cn('size-8 cursor-pointer fill-black', className)} />;
};
```

## DO / DON'T

- ✅ 색/크기/회전 변형은 단일 SVG + Tailwind 유틸로 표현.
- ❌ 색상 변형마다 새 SVG 파일 import 금지.
- ❌ JPG/PNG 신규 도입 금지 (기존 자산 마이그레이션 외).

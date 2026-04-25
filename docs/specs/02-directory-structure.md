# 02. Directory Structure

## 루트

```
.
├── AGENTS.md           # AI 도구 전역 룰 (Next.js 버전 주의 사항)
├── CLAUDE.md           # AI 도구 프로젝트 룰 (AGENTS.md 참조)
├── amplify.yml
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── tsconfig.json
├── package.json / pnpm-lock.yaml / pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
├── docs/               # 본 스펙 디렉터리
├── out/
└── src/
```

> ❗ **`src/` 외부에 새 파일 생성 금지** (루트 설정 파일 제외).

## src/ 개요

```
src/
├── app/              # Next.js App Router (라우팅)
├── assets/           # SVG / 이미지 / 정적 에셋
├── components/       # 공용/페이지별 컴포넌트
├── constants/        # 변하지 않는 상수
├── hooks/            # 전역 공용 클라이언트 훅
├── lib/              # API, 타입, 유틸, 스토어, 스키마, 모킹
└── style/            # 전역 스타일
```

각 폴더의 세부 규칙은 별도 스펙에서 다룹니다.

| 폴더 | 스펙 |
| --- | --- |
| `src/app/` | [03-routing.md](./03-routing.md) |
| `src/assets/` | [05-assets.md](./05-assets.md) |
| `src/components/` | [04-components.md](./04-components.md) |
| `src/constants/` | [06-constants.md](./06-constants.md) |
| `src/hooks/` | [10-hooks.md](./10-hooks.md) |
| `src/lib/api/*` | [07-api-layer.md](./07-api-layer.md) |
| `src/lib/stores/*` | [08-state-management.md](./08-state-management.md) |
| `src/style/` | [09-styling.md](./09-styling.md) |

## src/ 상세 트리 (예시)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── register/
│       └── page.tsx
├── assets/
│   ├── common/
│   │   ├── images/
│   │   ├── svgs/
│   │   │   ├── ic_*.svg
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pages/
│   └── index.ts
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── LinkButton.tsx
│   │   │   ├── buttonVariants.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pages/
│   │   ├── Main/
│   │   │   ├── Body.tsx
│   │   │   └── index.tsx        # Container
│   │   ├── Register/
│   │   │   └── index.tsx
│   │   └── index.ts
│   └── index.ts
├── constants/
│   ├── endPoint.ts
│   ├── pathName.ts
│   ├── queryKey.ts
│   └── index.ts
├── hooks/
│   ├── useMobile.ts
│   └── index.ts
├── lib/
│   ├── api/
│   │   ├── http/
│   │   │   ├── httpBase.ts
│   │   │   ├── publicHttp.ts
│   │   │   ├── clientAuthHttp.ts
│   │   │   ├── serverAuthHttp.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── register/
│   │   ├── types/
│   │   │   ├── common/
│   │   │   └── register/
│   │   └── index.ts
│   ├── mocks/
│   ├── schemas/                  # zod 스키마
│   ├── stores/                   # zustand 스토어
│   ├── utils.ts                  # cn 등
│   └── index.ts
└── style/
    └── global.css
```

> `common/` 하위 컴포넌트가 모두 위의 `Button`처럼 복잡한 폴더 구조를 가질 필요는 없습니다. 동일한 시각적 스타일을 공유하되 **기능을 다르게 나누어야 할 때**(파생 컴포넌트 추가, Variant 분기 등)에만 폴더를 만들고 `cva`로 관리합니다.

## Import Alias

- `src/` 내부 import는 항상 **`@/`** 사용
- 디렉터리 경계를 넘는 `../` 상대경로 **금지**
- alias는 `tsconfig.json`의 `paths` **한 곳에서만** 정의

```ts
// GOOD
import { Button } from '@/components';
import { useAuthStore } from '@/lib';
import { PATH_NAME } from '@/constants';

// BAD
import { Button } from '../../components/common/Button';
```

각 폴더 끝에는 반드시 `index.ts`를 두고 named re-export로 묶습니다.
자세한 규칙은 [11-coding-conventions.md](./11-coding-conventions.md#임포트--재내보내기) 참고.

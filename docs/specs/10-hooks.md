# 10. Custom Hooks (`src/hooks/`)

전역에서 공통으로 쓰는 **순수 클라이언트 훅**을 모읍니다.

```
hooks/
├── useMobile.ts
└── index.ts
```

## 규칙

- 파일/함수명: `use`로 시작하는 **camelCase** (`useMobile`, `useDebounce`).
- `src/hooks/`에는 **서버 상태/데이터 패칭 훅을 두지 않습니다.** 서버 상태는 TanStack Query 쪽 (`src/lib/api/services/`). → [08-state-management.md](./08-state-management.md)
- 외부 export는 `src/hooks/index.ts`에 named re-export로 모읍니다.
- 사용하는 측에서는 `import { useMobile } from '@/hooks';`처럼 한 줄로 import.

## 예시 — `useMobile`

```tsx
'use client';

import { useEffect, useState } from 'react';

type Props = {
  kind: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1640,
};

export const useMobile = (props: Props): boolean => {
  const { kind } = props;
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINTS[kind]}px)`);

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [kind]);

  return isMobile;
};
```

## DO / DON'T

- ✅ 브라우저 API(window, matchMedia, intersection observer 등) 래핑.
- ✅ 여러 컴포넌트가 반복하는 클라이언트 사이드 로직 추출.
- ❌ API fetch / 서버 상태 캐시 훅 — TanStack Query 도메인 파일에 작성.
- ❌ 한 컴포넌트만 쓰는 훅 — 컴포넌트 옆에 두고, 두 번째 사용처가 생길 때 승격.

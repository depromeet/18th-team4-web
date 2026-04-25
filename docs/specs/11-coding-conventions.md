# 11. Coding Conventions

## 임포트 / 재내보내기

- `src/` 내부 import는 항상 **`@/`** alias 사용. `../`로 디렉터리 경계를 넘지 않습니다.
- alias 정의는 `tsconfig.json`의 `paths` 한 곳에서만.
- 폴더에는 반드시 `index.ts`를 두고 named re-export로 묶어 **import 한 줄로 정리**합니다.

```tsx
// GOOD
import { useGetPassVerifyStatus, useGetUnReadChatRoomCount } from '@/api';
import { HIT_SLOP_MD, ROUTERS, queryKey } from '@/lib';
import ChatSvg from '@icons/ionicons-chat-outline.svg';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
```

```tsx
// BAD — 디렉터리 경계 넘는 상대경로 + 같은 영역에서 여러 줄로 import
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Pagination } from '../../components/Common/Pagination';
import { ExamContent, type ExamProps } from '../../components/Common/ExamContent';
import { NoData } from '../../components/Common/NoData';
import { useApi } from '../../api/apiService';
import { usePlatform } from '../../hooks/usePlatform';
import { Helmet } from 'react-helmet';
import { ORIGIN } from '../../constants/environments';
```

### `index.ts` 재내보내기 규칙

각 폴더의 `index.ts`는 named re-export만 담습니다.

```ts
// components/common/index.ts
export { default as AddressListSection } from './AddressListSection';
export { default as BannerSection } from './BannerSection';
export { default as ButcheryText } from './ButcheryText';
// ...
```

### 타입 import

타입 import는 **인라인 `type` 키워드**를 사용합니다. `import type { … }` 분리 구문은 사용하지 않습니다.

```ts
// GOOD
import { type Metadata } from 'next';
import { type NoticeListResponse } from '@/lib';
import { Button, type ButtonProps } from '@/components';

// BAD — 분리된 import type 구문 사용 금지
import type { Metadata } from 'next';
```

## 컴포넌트 / 함수 선언

- 컴포넌트와 함수는 **arrow function**(`const Foo = () => {}`)으로 작성합니다. **명명 함수 선언(`function Foo()`) 금지.**
- `default export`는 페이지 컴포넌트(`app/**/page.tsx`) + Container(`components/pages/<Page>/index.tsx`)에 한해 허용. 그 외에는 named export.
- `React.FC` 사용 금지 — 명시적 props 타입 + arrow function.

```tsx
// GOOD
type Props = {
  className?: string;
};

const TermFooter = (props: Props) => {
  const { className } = props;
  // ...
};

export default TermFooter;
```

```tsx
// BAD — 명명 함수 선언 금지
export default function TermFooter(props: Props) {
  // ...
}
```

## Props 처리

- Props 타입은 컴포넌트 위에 선언.
- 외부 노출 시 `[ComponentName]Props`, 내부 한정이면 `Props`로 명명.
- 함수 시그니처에서 구조분해하지 말고, **`props`로 받아 본문에서 구조분해**합니다.

```tsx
// GOOD
type Props = {
  className?: string;
};

const TermFooter = (props: Props) => {
  const { className } = props;
  // ...
};

export default TermFooter;
```

```tsx
// BAD — 시그니처에서 구조분해하면 Props가 늘어날수록 가독성이 떨어짐
export const ClassLists = ({
  lists,
  testTypeSort,
  startDateSort,
  setTestTypeSort,
  setStartDateSort,
  total,
  currentPage,
}: ListProps) => {
  // ...
};
```

## 타입 사용

- ❌ **`any` 금지** → `unknown` 또는 정확한 타입 사용.
- ❌ **`interface` 선언 금지** → 모든 타입 선언은 `type`으로 통일.
- ✅ 확장이 필요한 경우 `&`(intersection)로 결합. (`extends` 대신)
- ✅ `as const`로 readonly 보장이 필요한 객체 상수 표현.

```ts
// GOOD
type ApiRequestInit = RequestInit & {
  responseType?: 'blob' | 'json';
};

// BAD
interface ApiRequestInit extends RequestInit {
  responseType?: 'blob' | 'json';
}
```

## 콘솔 / 사이드 이펙트

- ❌ commit 코드에 `console.log` 남기지 않음.
- ✅ 필요한 경우 `console.warn` / `console.error`만 허용.
- ❌ `process.env`에 직접 접근 금지 → `@/config/env`를 통해 사용. → [01-tech-stack.md](./01-tech-stack.md#환경-변수)

## 의존성 추가

- 새 패키지를 추가할 때는 **PR 설명에 도입 이유**를 반드시 명시합니다.
- 빌드/툴링 의존성 변경은 `chore` 커밋으로 분리합니다. → [12-git-conventions.md](./12-git-conventions.md#커밋-컨벤션)

## 한국어 사용

- 사용자 노출 텍스트, 도메인 코멘트는 한국어 작성을 기본으로 합니다.
- 기술 용어/식별자(변수명, 타입명 등)는 영어 그대로 둡니다.

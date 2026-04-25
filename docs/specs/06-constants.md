# 06. Constants (`src/constants/`)

변하지 않는 readonly 값 모음. URL/엔드포인트/쿼리키/드롭다운 옵션 등 **하드코딩이 흩어지면 유지보수가 깨지는 값**은 모두 여기로 모읍니다.

```
constants/
├── pathName.ts
├── queryKey.ts
├── endPoint.ts
└── index.ts
```

## 공통 규칙

- 객체는 `as const`로 readonly 보장
- 동적 값(id, params, query string)은 **함수 형태**로 받도록 작성
- 각 상수는 도메인 단위로 중첩(`PATH_NAME.about.intro`)
- import는 `@/constants` 한 줄로 묶음 (`index.ts`에서 re-export)

## PATH_NAME

페이지 이동 시 URL 문자열을 직접 쓰지 않고 모두 이 상수로 대체합니다.

```ts
// constants/pathName.ts
export const PATH_NAME = {
  main: () => '/',

  about: {
    intro: () => '/about/intro',
    members: () => '/about/members',
    students: (type: string) => `/about/students?type=${type}`,
    rules: () => '/about/rules',
    location: () => '/about/location',
  },
} as const;
```

```tsx
// 사용
<Link
  href={PATH_NAME.journal.archive()}
  className="px-7.5 rounded-[100px] border border-[#2F288C] bg-[#1C1760] py-4 ..."
>
  <p className="text-base font-bold leading-[20.8px] tracking-[-0.16px] text-white">목록으로</p>
</Link>
```

## QUERY_KEY

TanStack Query / Next fetch tag 양쪽에서 사용합니다.
구조는 `['도메인', ...params]` 배열이 기본이며, invalidation/prefetch 시 팩토리 함수로 사용합니다. → [08-state-management.md](./08-state-management.md#tanstack-query)

```ts
// constants/queryKey.ts
export const QUERY_KEY = {
  deliveryZone: {
    all: ['deliveryZone'],
    list: ['deliveryZone', 'list'],
  },
} as const;
```

## ENDPOINTS

API 경로도 직접 문자열로 두지 않고 함수형 상수로 관리합니다.

```ts
// constants/endPoint.ts
export const ENDPOINTS = {
  /*
   * EXAMPLE
   * 사용자 - 논문 아카이브
   */
  PAPER: {
    // 논문 아카이브 목록 조회
    archieve: () => '/paper-archives',

    // 논문 아카이브 상세 조회
    detail: (id: number) => `/paper-archives/${id}`,
  },
} as const;
```

## DO / DON'T

- ✅ URL / endpoint / queryKey는 모두 함수로 작성해 dynamic params를 자연스럽게 받도록 한다.
- ✅ 상수에 한국어 코멘트로 도메인 설명을 짧게 남긴다 (위 `// 논문 아카이브 목록 조회`).
- ❌ 컴포넌트/서비스 안에 raw URL 문자열을 직접 작성하지 않는다.

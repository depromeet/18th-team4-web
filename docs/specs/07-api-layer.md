# 07. API Layer (`src/lib/api/` 외)

```
lib/
├── api/
│   ├── http/
│   │   ├── httpBase.ts
│   │   ├── publicHttp.ts
│   │   ├── clientAuthHttp.ts
│   │   ├── serverAuthHttp.ts
│   │   └── index.ts
│   ├── services/         # 컴포넌트에서 바로 사용하는 도메인 함수
│   │   └── <도메인>/
│   │       ├── index.ts
│   │       └── <리소스>.ts (+ <리소스>.client.ts)
│   ├── types/            # 요청/응답 타입
│   │   ├── common/
│   │   └── <도메인>/
│   └── index.ts
├── mocks/                # Mock 데이터
├── schemas/              # zod 스키마 (유효성 검사)
├── stores/               # zustand 스토어 → 08 스펙 참조
├── utils.ts              # cn 등 유틸 함수
└── index.ts
```

## http/ — fetch 베이스 커스터마이징

| 파일 | 용도 |
| --- | --- |
| `httpBase.ts` | 가장 기초가 되는 fetch 함수 커스터마이징 (모든 변형의 베이스) |
| `publicHttp.ts` | 쿠키 불필요 — **SSR 전용** (쿠키가 없는데 CSR이 필요한 경우는 거의 없음) |
| `clientAuthHttp.ts` | 쿠키 필요 (로그인 필요) — **CSR 전용** |
| `serverAuthHttp.ts` | 쿠키 필요 (로그인 필요) — **SSR 전용** |

## services/ — 컴포넌트에서 사용하는 API 함수

`http/`의 fetch 변형을 가져다, 컴포넌트가 그대로 호출할 수 있는 함수를 만들어 export합니다.

```ts
// lib/api/services/notice.ts
import { ENDPOINTS } from '@/constants';
import {
  publicHttp,
  type NoticeDetailRequest,
  type NoticeDetailResponse,
  type NoticeListRequest,
  type NoticeListResponse,
} from '@/lib';

export const getNoticeList = async (request: NoticeListRequest) => {
  const params = new URLSearchParams();
  params.set('page', String(request.page));
  params.set('limit', String(request.limit));

  if (request.searchField && request.searchKeyword) {
    params.set('searchField', request.searchField);
    params.set('searchKeyword', request.searchKeyword);
  }

  const response = await publicHttp.get<NoticeListResponse>(
    `${ENDPOINTS.PAPER.archieve()}?${params.toString()}`,
    { cache: 'force-cache' },
  );

  return { data: response.data, paginationData: response.meta };
};

export const getNoticeDetail = async (request: NoticeDetailRequest) => {
  const response = await publicHttp.get<NoticeDetailResponse>(
    `${ENDPOINTS.PAPER.detail(Number(request.id))}`,
  );
  return response.data;
};
```

### SSR 함수와 CSR 함수의 분리

같은 도메인 안에서 SSR/CSR 함수가 모두 필요한 경우 **파일을 분리**합니다.

```
services/<도메인>/
├── index.ts
├── reservation.ts          # SSR 전용
├── reservation.client.ts   # CSR 전용
├── survey.ts
└── survey.client.ts
```

## 캐시 정책

- 기본은 `cache: 'no-store'`
- ISR이 필요한 경우 `cache: 'force-cache'` 지정. 필요 시 `next.revalidate` 옵션 추가.
- 캐시 정책은 추후 `constants/`로 정리 예정.

### Next Cache Config (예시)

```ts
export const nextCacheConfig = Object.freeze({
  realtime: Object.freeze({ next: { revalidate: 0 }, cache: 'no-store' }),
  shortLived: Object.freeze({ next: { revalidate: 60 }, cache: 'force-cache' }),       // 1분
  mediumLived: Object.freeze({ next: { revalidate: 180 }, cache: 'force-cache' }),     // 3분
  longLived: Object.freeze({ next: { revalidate: 1800 }, cache: 'force-cache' }),      // 30분
  immutable: Object.freeze({ next: { revalidate: false }, cache: 'force-cache' }),     // 영구 캐시 (ISR)
} as const);
```

### React Query Config (예시)

```ts
export const cacheConfig = Object.freeze({
  realtime: Object.freeze({ staleTime: 0, gcTime: 1000 * 60 * 5 }),
  shortLived: Object.freeze({ staleTime: 1000 * 60, gcTime: 1000 * 60 * 10 }),
  mediumLived: Object.freeze({ staleTime: 1000 * 60 * 3, gcTime: 1000 * 60 * 15 }),
  longLived: Object.freeze({ staleTime: 1000 * 60 * 30, gcTime: 1000 * 60 * 60 }),
  immutable: Object.freeze({ staleTime: Infinity, gcTime: 1000 * 60 * 60 * 24 }),
});
```

## CSR 데이터 패칭 전략

- React Query 도입 후 `useSuspenseQuery` + `HydrationBoundary` 조합 사용 예정
- Mutation은 `onSuccess` / `onError` 활용을 위해 `useMutation` 사용
- 자세한 규칙: [08-state-management.md](./08-state-management.md#tanstack-query)

## types/ — API 요청/응답 타입

API 데이터 전송용 타입은 모두 `types/`에 둡니다. (다른 타입은 각자 파일 옆에 둠)

### Common (베이스)

```ts
// lib/api/types/common/index.ts
export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
  meta: PaginationType;
};

export type PaginationType = {
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
};

export type ApiRequestInit = RequestInit & {
  responseType?: 'blob' | 'json';
  xForwardedFor?: string;
};
```

### 도메인 타입

`ApiResponse<T>` 제네릭으로 응답 타입을 만듭니다.

```ts
// lib/api/types/register/notice.ts
import { type ApiResponse } from '@/lib';

export type NoticeItem = {
  id: number;
  title: string;
  createdAt: string;
  type: string;
};

export type NoticeItemDetail = NoticeItem & {
  content: string;
  files: string[];
  originalFiles: string[];
};

export type NoticeListRequest = {
  page: number;
  limit: number;
  searchField?: string;
  searchKeyword?: string;
};

export type NoticeDetailRequest = {
  id: string;
};

export type NoticeListResponse = ApiResponse<NoticeItem[]>;
export type NoticeDetailResponse = ApiResponse<NoticeItemDetail>;
```

## schemas/ — zod 스키마

폼 / 응답 유효성 검사가 필요한 경우 `lib/schemas/`에 zod 스키마를 둡니다.

```
schemas/
├── auth.ts
└── index.ts
```

## mocks/ — 모킹 데이터

페이지별/공통으로 필요한 mock 데이터를 둡니다. 추후 MSW 도입 검토.

## DO / DON'T

- ✅ 컴포넌트는 `@/lib`의 service 함수를 호출. http 레이어를 직접 부르지 않음.
- ✅ 모든 타입은 `type`으로 선언. 확장이 필요하면 `&`(intersection) 사용.
- ✅ 타입 import는 인라인 형식 — `import { type ApiResponse } from '@/lib';`
- ✅ SSR/CSR 함수가 한 도메인에서 동시에 필요하면 `*.client.ts` 분리.
- ✅ service 함수는 arrow function (`export const getNoticeList = async (req) => {…}`).
- ❌ `interface` 선언 금지 (`extends` 대신 `&`).
- ❌ `useEffect` + `fetch`로 데이터 패칭 금지 → TanStack Query 사용.
- ❌ `any` 사용 금지 — `unknown` 또는 정확한 타입을 사용.

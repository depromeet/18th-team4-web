# 08. State Management

상태는 **클라이언트 상태**(Zustand)와 **서버 상태**(TanStack Query)로 명확히 분리합니다.

| 영역 | 도구 | 위치 |
| --- | --- | --- |
| 클라이언트 / 전역 UI 상태 | Zustand | `src/lib/stores/` |
| 서버 상태 (API 응답) | TanStack Query | `src/lib/api/services/` |

## Zustand — 클라이언트/전역 UI 상태

```
lib/stores/
├── useAuthStore.ts
└── index.ts
```

### 규칙

- **도메인별 1개 스토어** (예: `useAuthStore`, `useUIStore`).
- 항상 `devtools` 미들웨어로 감싸기.
- 파일 위치는 `src/lib/stores/`. 외부에서는 `@/lib`로 import.
- **서버에서 받아온 데이터(API 응답)를 Zustand에 저장하지 않음.** 서버 상태는 TanStack Query에 둡니다.

## TanStack Query — 서버 상태

### 파일 구조

- **도메인별 단일 파일**: 한 도메인의 `queryOptions` + query/mutation hook을 한 파일에서 함께 정의합니다.
- 컴포넌트에서는 **custom hook만** 사용합니다.

```ts
// 컴포넌트에서
const { data } = useUsers();
```

### 쿼리키 구조

쿼리키는 `['도메인', ...params]` 배열을 따르며, [`QUERY_KEY`](./06-constants.md#query_key) 상수로 관리합니다.

invalidation/prefetch는 팩토리로 타입 안전하게:

```ts
queryClient.invalidateQueries(userQueries.all());
```

### CSR 패턴

- `useSuspenseQuery` + `HydrationBoundary` 조합을 기본으로 합니다. (Next 서버에서 prefetch 후 클라이언트에서 hydrate)
- Mutation은 `useMutation`을 사용해 `onSuccess` / `onError`로 후속 처리합니다.

### 금지 사항

- ❌ `useEffect`로 데이터 패칭하지 않음 — 항상 TanStack Query 사용.
- ❌ `src/hooks/`에 서버 상태 관련 훅을 두지 않음 — `src/hooks/`는 순수 클라이언트 훅 전용. → [10-hooks.md](./10-hooks.md)
- ❌ TanStack Query 캐시를 UI 상태 저장소로 사용하지 않음.
- ❌ 서버 응답 데이터를 Zustand 스토어에 복사해 저장하지 않음.

## 분류 가이드

새 상태가 생겼을 때:

1. **API에서 내려주는 값인가?** → TanStack Query (`src/lib/api/services/`)
2. **여러 컴포넌트가 공유하는 UI 상태인가?** (사이드바 open, 토스트 등) → Zustand (`src/lib/stores/`)
3. **단일 컴포넌트 내에서만 쓰이는가?** → `useState` / `useReducer`
4. **폼 입력 값인가?** → React Hook Form

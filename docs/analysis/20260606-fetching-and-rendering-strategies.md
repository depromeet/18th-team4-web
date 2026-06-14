# API 페칭 · 페이지 빌드 전략 분석

> Readum Web이 현재 사용하는 데이터 페칭/렌더링 전략을 의도와 사용 시점 중심으로 정리한 문서.
> 관련 스펙: [03-routing](../specs/03-routing.md) · [07-api-layer](../specs/07-api-layer.md) · [08-state-management](../specs/08-state-management.md)
> 기준일: 2026-06-06

## 0. 요약

모든 전략의 전제는 **httpOnly `user_session` 쿠키 기반 익명 유저 세션**이다.
거의 모든 데이터가 쿠키에 묶인 개인화 데이터라서 사용자 간 공유 캐시(SSG/ISR)에 올릴 수 없고, 구조 전체가 **dynamic SSR + CSR(TanStack Query)** 조합으로 수렴한다.

핵심 한 줄:

> 쿠키가 묶인 개인화 데이터라서 공유 캐시를 버리고, **SSR(첫 분기·첫 페인트) + TanStack Query(상호작용)** 두 축으로 나눈 뒤, `initialData`로 둘을 잇는다.

| 전략              | 위치                           | 한 줄 의도                                  |
| ----------------- | ------------------------------ | ------------------------------------------- |
| 세션 부트스트랩   | `src/proxy.ts`                 | 로그인 없이 첫 요청에서 익명 세션 발급      |
| HTTP 래퍼 4종     | `src/lib/api/http/`            | 실행 환경(SSR/CSR)·인증 방식별 쿠키 전달    |
| SSR 직접 페칭     | `*.server.ts`                  | 첫 페인트·렌더 분기에 필요한 데이터 선확보  |
| CSR 페칭          | `*.client.ts` + `*.service.ts` | 상호작용으로 발생하는 서버 상태 캐시/동기화 |
| SSR→CSR Hydration | `initialData` prop             | SSR로 즉시 렌더 + CSR이 이어받기            |
| 특수 패턴         | SSE·폴링·infinite·revalidate   | 스트리밍/대기/무한스크롤/서버 재렌더        |

## 1. 큰 그림: "익명 세션 쿠키"라는 전제

- API는 [httpOnly `user_session` 쿠키 기반 익명 세션](../specs/07-api-layer.md)을 전제로 한다. 브라우저 JS는 쿠키 값을 **읽지 않고**, 쿠키를 "어떻게 요청에 실어 보내느냐"가 모든 래퍼의 분기 축이 된다.
- 거의 모든 응답이 쿠키에 묶인 **개인화 데이터** → 사용자 간 공유 캐시(SSG/ISR/force-cache) 사용 불가.
- 그 결과 앱은 **SSG/ISR을 의도적으로 포기**하고, dynamic SSR을 기본값으로 삼되 첫 페인트는 SSR로 빠르게 주고 이후는 CSR 캐시로 메운다.

## 2. API 페칭 전략

### 2.1 세션 부트스트랩 — Proxy

**의도:** 사용자가 첫 요청을 보내는 순간, 로그인 없이도 세션을 쥐여준다.

- `user_session` 쿠키가 없으면 `POST /users/sessions`로 세션 발급 (`src/proxy.ts:9`).
- 응답 `Set-Cookie`에서 값을 추출해 ① 앱 origin httpOnly 쿠키로 심고(`src/proxy.ts:36`) ② **같은 요청의 request 헤더에도 주입**한다(`src/proxy.ts:26`).
- ②가 핵심 트릭이다. 쿠키를 응답에만 심으면 _다음_ 요청부터 유효한데, 헤더에도 주입해서 **바로 그 첫 요청의 서버 컴포넌트도 세션을 즉시 읽게** 만든다.

**언제:** 자동. `api`/`_next` 등을 제외한 모든 페이지 진입에서 동작 (`src/proxy.ts:64`).

### 2.2 HTTP 래퍼 4종 — 쿠키 전달 방식으로 분기

모든 래퍼는 `httpBase`(`src/lib/api/http/httpBase.ts`) 위에 얹혀 있고, `httpBase`가 **실행 환경을 감지**한다.

- 서버면 `next/headers`의 `cookies()`로 현재 요청 쿠키를 모아 `Cookie` 헤더에 첨부 (`httpBase.ts:37`).
- 클라이언트면 `credentials: 'include'`로 same-origin 쿠키 동봉 (`httpBase.ts:57`).
- 서버에서 상대경로가 들어오면 `API_PROXY_TARGET`을 붙여 절대 URL로 변환 (`httpBase.ts:5`).

| 래퍼             | 인증 방식                  | 언제 쓰나                         | 의도                                                           |
| ---------------- | -------------------------- | --------------------------------- | -------------------------------------------------------------- |
| `publicHttp`     | `user_session` 쿠키 (자동) | **신규 API 기본값.** SSR·CSR 공통 | 현재 세션 정책의 표준 래퍼                                     |
| `clientAuthHttp` | `Bearer` 토큰 + `stream()` | 채팅 SSE 등 레거시 흐름           | 토큰 인증 + 스트림 전용. 신규엔 지양                           |
| `serverAuthHttp` | 서버 쿠키(access/refresh)  | `/auth/*` 토큰 API                | 헤더 인젝션 방어까지 하는 서버 토큰용 (`serverAuthHttp.ts:13`) |
| `httpBase`       | (직접 호출)                | JSON이 아닌 응답(SSE/blob)        | 공통 베이스. JSON을 강제하므로 SSE는 우회                      |

> `clientAuthHttp`/`serverAuthHttp`는 토큰 기반 레거시 흔적이다. 스펙도 "신규 일반 JSON API는 `publicHttp` 우선"으로 못박고 있다. 새 도메인을 추가할 때 이유 없이 토큰 래퍼를 끌어다 쓰지 않는다.

#### 2.2.1 `httpBase` — 모든 래퍼의 공통 베이스 (단일 함수)

래퍼가 아니라 `httpBase<T>(url, options)` 단일 함수다. 모든 래퍼가 내부에서 이걸 호출하며, **service 코드가 직접 호출하는 곳은 없다.**

| 처리 단계      | 동작                                                                          | 근거            |
| -------------- | ----------------------------------------------------------------------------- | --------------- |
| URL 해석       | 서버 실행 + 상대경로면 `API_PROXY_TARGET` prefix 부착                         | `httpBase.ts:5` |
| 쿠키 전달      | 서버: `cookies().getAll()` → `Cookie` 헤더 / 클라: `credentials:'include'`    | `:37`, `:57`    |
| 기본 헤더      | `Content-Type: application/json` (옵션으로 덮어쓰기 가능)                     | `:32`           |
| 네트워크 실패  | `HttpError(status: 503)` 변환                                                 | `:62`           |
| `!res.ok`      | 에러 body에서 `message`/`errorCode`/`path` 추출 → `HttpError`                 | `:67`           |
| 빈 응답        | `204` 또는 `content-length:0` → `undefined` 반환                              | `:94`           |
| 비-JSON        | `content-type`이 json 아니면 `undefined` / `responseType:'blob'`이면 `blob()` | `:89`, `:99`    |
| JSON 파싱 실패 | `HttpError(status: 502)`                                                      | `:106`          |

#### 2.2.2 `publicHttp` — 표준 래퍼 (`user_session` 쿠키)

| 메서드           | HTTP   | `cache`            | body             | 비고                   |
| ---------------- | ------ | ------------------ | ---------------- | ---------------------- |
| `get<T>`         | GET    | 미지정 (Next 기본) | -                | `...options` 펼침      |
| `post<req,res>`  | POST   | `no-store`         | `JSON.stringify` | Content-Type json 강제 |
| `patch<req,res>` | PATCH  | `no-store`         | `JSON.stringify` |                        |
| `put<T>`         | PUT    | `no-store`         | `JSON.stringify` |                        |
| `delete<T>`      | DELETE | `no-store`         | -                |                        |

> `get`만 `cache`를 지정하지 않고, 나머지 쓰기 메서드는 전부 `no-store`다 (`publicHttp.ts:19`).

#### 2.2.3 `clientAuthHttp` — CSR 토큰 + 스트림

토큰은 `useAuthStore.getState().token`에서 읽는다. 단 현재 정책은 쿠키 인증이라 실제 인증은 `httpBase`의 `credentials:'include'` 쿠키로 이뤄지고, Bearer는 보조 수단이다.

| 메서드           | HTTP   | Bearer 토큰 | `cache`    | 비고                                                                 |
| ---------------- | ------ | ----------- | ---------- | -------------------------------------------------------------------- |
| `get<T>`         | GET    | ✅          | 기본       | `Authorization` 헤더 부착                                            |
| `post<req,res>`  | POST   | ❌          | `no-store` | **토큰 미첨부 (비대칭)**                                             |
| `put<T>`         | PUT    | ✅          | 기본       |                                                                      |
| `patch<req,res>` | PATCH  | ❌          | `no-store` | **토큰 미첨부 (비대칭)**                                             |
| `delete<T>`      | DELETE | ✅          | 기본       |                                                                      |
| `stream`         | POST   | ✅ (있으면) | -          | **`httpBase` 우회.** raw `fetch` → `Response` 그대로 반환 (SSE 전용) |

> `get`/`put`/`delete`만 Bearer를 붙이고 `post`/`patch`는 붙이지 않는 비대칭이 있다 (`clientAuthHttp.ts:19`, `:41`). `stream`은 JSON 파싱을 건너뛰어야 해서 `httpBase`를 거치지 않는다 (`:62`).

#### 2.2.4 `serverAuthHttp` — 서버 쿠키 토큰 (⚠️ 현재 미사용)

| 메서드                            | HTTP | 쿠키 처리                                                                                                             | `cache`    |
| --------------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------- | ---------- |
| `get` / `post` / `put` / `delete` | 각각 | `cookies()`에서 `accessToken`/`refreshToken` 추출 → `Cookie` 헤더. `sanitizeCookieValue`로 헤더 인젝션·과대 길이 방어 | `no-store` |

> ⚠️ **`http/index.ts`에서 export되지 않고, 코드베이스 어디서도 import되지 않는 dead code다** (`grep` 결과 정의부만 존재). 토큰 인증 정책의 잔재로, 현재 `user_session` 쿠키 정책에서는 사용처가 없다. 토큰 인증을 다시 도입하지 않는 한 제거 후보.

### 2.3 SSR 직접 페칭 — `*.server.ts` + `React.cache`

**의도:** 첫 페인트에 필요하거나 **렌더 분기를 결정짓는** 데이터를 서버에서 미리 확보한다.

```ts
// users.server.ts:11
export const getUserSession = cache(async () => {
  const response = await publicHttp.get<UserSessionResponse>(ENDPOINTS.USERS.me());
  return response.data;
});
```

- `React.cache`로 감싸 **요청 단위 memoization** — layout/page 어디서 호출해도 API는 1회. 사용자 간 공유 캐시가 **아님**에 주의.
- 페이지/서버 Container에서 그냥 `await` 한다 (`src/app/page.tsx:13`, `Main/Container.tsx:23`).
- 쿠키는 인자로 넘기지 않는다 — `httpBase`가 알아서 첨부한다.

**언제:** 온보딩 여부로 화면이 갈리는 홈, 첫 화면에 요약이 있어야 하는 summary 등.

### 2.4 CSR 페칭 — TanStack Query 3단 분리

**의도:** 상호작용으로 발생하는 서버 상태를 캐시·동기화한다. `useEffect + fetch`는 금지 ([08-state-management](../specs/08-state-management.md)).

```txt
<domain>.client.ts   → raw API 함수
<domain>.service.ts  → 'use client' + useQuery/useInfiniteQuery/useMutation hook
컴포넌트              → hook만 사용 (raw 함수 직접 호출 X)
```

- QueryClient 기본값: `staleTime 60s`, `retry 1` (`QueryProvider.tsx:16`).
- 서버 상태 hook은 `src/hooks/`가 아니라 **`src/lib/api/services/`에만** 둔다.

**언제:** 책 검색, 채팅 세션 목록, 메시지 등 클라이언트에서 발생하는 모든 서버 상태.

### 2.5 SSR → CSR Hydration — `initialData` 주입

**의도:** SSR로 받은 첫 데이터를 CSR 쿼리에 이어붙여 **즉시 렌더 + 이후 클라이언트가 이어받기**. 무거운 `HydrationBoundary`/`dehydrate` 대신 prop으로 가볍게 넘긴다.

```ts
// page(SSR): summary/[summaryId]/page.tsx:26
const initialSummary = await getSummary(summaryId).catch(() => null);
return <SummaryContainer initialSummary={initialSummary} ... />;

// hook(CSR): summary.service.ts:17
useQuery({ queryKey, queryFn, initialData: initialData ?? undefined, ... });
```

**언제:** SSR로 먼저 보여주되 클라이언트에서 갱신·폴링도 필요한 데이터(요약).

### 2.6 특수 페칭 패턴

| 패턴                                    | 위치                                    | 의도 / 언제                                                                                                                                            |
| --------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SSE 스트리밍**                        | `chat.client.ts:25` `streamChatMessage` | AI 응답 토큰 스트리밍. `httpBase`(JSON 강제) 대신 `body.getReader()`로 직접 파싱. 429 pre-stream + 200 내부 `error` 이벤트 이중 재시도 (`:43`, `:110`) |
| **폴링**                                | `summary.service.ts:23`                 | 요약 **생성 중(데이터 없음)**이면 3초 `refetchInterval`, 생기면 중단. 비동기 생성 작업 대기                                                            |
| **Infinite Query**                      | books·ai-chat·messages `*.service.ts`   | 무한스크롤. `hasNext`로 `getNextPageParam` 계산                                                                                                        |
| **Mutation + Server Action revalidate** | `app/actions/users.ts:12`               | CSR mutation 대신 server action에서 처리 후 `revalidatePath('/')` → SSR 화면(온보딩 분기 등)을 서버에서 다시 그림                                      |
| **enabled 가드**                        | `books.service.ts:32`                   | 불필요한 호출 방지(2자 이상). 한글 grapheme 단위 카운트까지 고려                                                                                       |

### 2.7 `lib/api` 폴더 구조 & 도메인별 처리 매트릭스

#### 폴더 구조

```txt
src/lib/api/
├── http/
│   ├── httpBase.ts        # 공통 fetch 베이스 (모든 래퍼가 내부 사용)
│   ├── publicHttp.ts      # ✅ 표준 (user_session 쿠키)
│   ├── clientAuthHttp.ts  # CSR 토큰+스트림 (messages·summary-eligibility·chat)
│   ├── serverAuthHttp.ts  # ⚠️ 미사용 (export X, import X)
│   └── index.ts           # clientAuthHttp, HttpError, publicHttp만 export
├── services/<domain>/
│   ├── <domain>.client.ts   # CSR raw 함수
│   ├── <domain>.server.ts   # SSR raw 함수 (React.cache) — 일부 도메인만
│   ├── <domain>.service.ts  # TanStack Query hook ('use client')
│   ├── <domain>.zod.ts      # 요청/응답 schema
│   ├── <domain>.type.ts     # z.infer 타입
│   └── index.ts
├── types/index.ts         # createResponseSchema (공통 응답 팩토리)
└── index.ts
```

**파일 구성 관찰:** `*.server.ts`는 `users`·`user-books`·`summary` 3개 도메인만 보유한다(첫 페인트·렌더 분기에 SSR이 필요한 경우). `books`·`ai-chat`·`chat`·`messages`·`summary-eligibility`는 CSR 전용이라 `*.server.ts`가 없다.

#### 매트릭스 A — 도메인 × raw 함수 (어떤 래퍼 메서드로 처리하나)

| 도메인                  | 함수                          | 파일   | 래퍼·메서드             | 엔드포인트                                             | 실행 | 특이사항                           |
| ----------------------- | ----------------------------- | ------ | ----------------------- | ------------------------------------------------------ | ---- | ---------------------------------- |
| **users**               | `getUserSession`              | server | `publicHttp.get`        | `GET /users/me`                                        | SSR  | `React.cache`                      |
|                         | `createUserSession`           | server | `publicHttp.post`       | `POST /users/sessions`                                 | SSR  | `proxy.ts`와 별개 경로             |
|                         | `completeOnboarding`          | server | `publicHttp.post`       | `POST /users/me/onboarding`                            | SSR  |                                    |
|                         | `patchLastSelectedUserBookId` | client | `publicHttp.patch`      | `PATCH /users/me`                                      | CSR  |                                    |
| **user-books**          | `getUserBooksServer`          | server | `publicHttp.get`        | `GET /user-books`                                      | SSR  | `React.cache`                      |
|                         | `getUserBooks`                | client | `publicHttp.get`        | `GET /user-books`                                      | CSR  | server와 동일 EP                   |
|                         | `addUserBook`                 | client | `publicHttp.post`       | `POST /user-books`                                     | CSR  |                                    |
| **books**               | `searchBooks`                 | client | `publicHttp.get`        | `GET /books?keyword&page&size`                         | CSR  |                                    |
| **ai-chat**             | `getSessions`                 | client | `publicHttp.get`        | `GET /ai-chat/sessions`                                | CSR  |                                    |
|                         | `createSession`               | client | `publicHttp.post`       | `POST /ai-chat/sessions`                               | CSR  | ⚠️ chat과 중복                     |
| **chat**                | `createChatSession`           | client | `clientAuthHttp.post`   | `POST /ai-chat/sessions`                               | CSR  | ⚠️ ai-chat과 중복                  |
|                         | `streamChatMessage`           | client | `clientAuthHttp.stream` | `POST /ai-chat/sessions/{id}/messages`                 | CSR  | SSE, `httpBase` 우회               |
| **messages**            | `getMessages`                 | client | `clientAuthHttp.get`    | `GET /ai-chat/sessions/{id}/messages`                  | CSR  |                                    |
| **summary**             | `getSummary`                  | server | `publicHttp.get`        | `GET /ai-chat/sessions/{id}/summary`                   | SSR  | `React.cache`, 409→`null`          |
|                         | `getSummary`                  | client | `publicHttp.get`        | (동일)                                                 | CSR  | ⚠️ server와 중복 정의 (cache 없음) |
|                         | `createSummaryDraft`          | client | `publicHttp.post`       | `POST /ai-chat/sessions/{id}/summary-draft`            | CSR  | 409 무시                           |
| **summary-eligibility** | `checkSummaryEligibility`     | client | `clientAuthHttp.get`    | `GET /ai-chat/sessions/{id}/summary-draft/eligibility` | CSR  |                                    |

#### 매트릭스 B — 도메인 × TanStack Query hook (어떻게 캐시/동기화하나)

| 도메인                  | hook                           | 종류               | 핵심 옵션                                                                 |
| ----------------------- | ------------------------------ | ------------------ | ------------------------------------------------------------------------- |
| **user-books**          | `useGetUserBooks`              | `useQuery`         | 기본                                                                      |
|                         | `useAddUserBook`               | `useMutation`      |                                                                           |
| **users**               | `usePatchLastSelectedUserBook` | `useMutation`      |                                                                           |
| **books**               | `useBookSearch`                | `useInfiniteQuery` | `enabled` ≥2자(grapheme), size 10                                         |
| **ai-chat**             | `useGetSessions`               | `useInfiniteQuery` | `staleTime: 0`, size 7                                                    |
|                         | `useCreateSession`             | `useMutation`      |                                                                           |
| **chat**                | `useCreateChatSession`         | `useMutation`      |                                                                           |
| **messages**            | `useGetMessages`               | `useInfiniteQuery` | `enabled`, `refetchOnMount`/`staleTime` 옵션화, size 20                   |
| **summary**             | `useSummary`                   | `useQuery`         | `initialData`(SSR 주입), `staleTime: Infinity`, `refetchInterval` 3s 폴링 |
|                         | `useCreateSummaryDraft`        | `useMutation`      |                                                                           |
| **summary-eligibility** | `useCheckSummaryEligibility`   | `useQuery`         | `enabled: !!sessionId`                                                    |

#### 구조 관찰 (개선 여지)

- **세션 생성 중복**: `ai-chat.createSession`(`publicHttp`)와 `chat.createChatSession`(`clientAuthHttp`)가 같은 `POST /ai-chat/sessions`를 **서로 다른 래퍼로** 호출한다. 한쪽으로 통일 가능.
- **`getSummary` 중복**: `summary.server.ts`(`React.cache`)와 `summary.client.ts`에 동일 로직이 두 벌 있고, 409 분기 처리도 복제돼 있다. SSR/CSR 경계 때문이지만 raw 로직은 공유 여지가 있다.
- **`clientAuthHttp` 잔존**: `messages`·`summary-eligibility`·`chat` 3개가 토큰 래퍼를 쓴다. 현재 쿠키 정책에선 `publicHttp`로 통일 가능하며 스펙 권고와도 어긋난다. 단 `chat.streamChatMessage`는 SSE라 `clientAuthHttp.stream`을 유지해야 한다.
- **`serverAuthHttp` dead code**: 정의만 있고 사용처가 없다(2.2.4 참조).

## 3. 페이지 빌드 · 렌더링 전략

### 3.1 페이지의 3대 책임만

`page.tsx`는 ① 컴포넌트 렌더 ② `generateMetadata` ③ `params`/`searchParams` resolve 후 Container 전달만 담당한다 — **그 외 로직 금지** ([03-routing](../specs/03-routing.md)). 실제 데이터 페칭과 분기는 전부 Container로 내려가 있다.

### 3.2 페이지는 두 유형으로 갈린다

**유형 1 — 데이터 의존 async 페이지** (SSR 분기/프리페치 필요)

- `/` (`src/app/page.tsx:12`): `getUserSession()` await → `MainContainer`가 서버에서 **온보딩 미완료→Onboarding, 책 미등록→`redirect`, 완료→책목록 SSR fetch 후 client shell**로 3분기 (`Main/Container.tsx:11`).
- `/summary/[summaryId]`: 요약 SSR fetch + `initialData` hydration.

**유형 2 — 셸만 렌더하는 동기 페이지** (CSR 위임)

- `/mypage`, `/chat`, `/chat/[sessionId]`, `/register`, `/register/complete`: 페이지는 Container만 렌더하고, 데이터는 하위 client 컴포넌트가 TanStack Query로 가져온다.

**판단 기준:** 첫 화면 분기/SEO/첫 페인트에 데이터가 필요한가 → 유형 1(SSR). 진입 후 상호작용으로 채워지는가 → 유형 2(CSR).

### 3.3 렌더링 모드: 명시적 지시어가 "없는" 게 전략

코드 전체에 `export const dynamic`, `revalidate`, `generateStaticParams`, `use cache`가 **하나도 없다.** 이는 누락이 아니라 의도된 결과다.

- 거의 모든 경로가 `cookies()`를 읽는 `httpBase`를 타므로 **자동으로 dynamic rendering**으로 빠진다.
- 개인화 데이터라 공유 캐시(force-cache/ISR)를 의도적으로 배제 — 쓰기 호출은 전부 `no-store` (`publicHttp.ts:19`).
- 정적 캐시 무효화는 SSG revalidate가 아니라 **server action의 `revalidatePath`로 dynamic 페이지를 다시 그리는** 방식이다.

## 4. 의사결정 가이드

| 상황                                  | 선택                                                     |
| ------------------------------------- | -------------------------------------------------------- |
| 화면 분기/SEO/첫 페인트에 데이터 필요 | **SSR**: `*.server.ts`(`React.cache`) + 페이지에서 await |
| 진입 후 상호작용으로 채워지는 데이터  | **CSR**: `*.client.ts` + `*.service.ts` hook             |
| SSR로 먼저 주고 CSR로 이어받기        | SSR fetch → prop → `useQuery({ initialData })`           |
| 새 일반 JSON API                      | `publicHttp` (토큰 래퍼 쓰지 말 것)                      |
| AI 토큰 스트리밍                      | `clientAuthHttp.stream` + reader (SSE)                   |
| 비동기 생성물 대기                    | `refetchInterval` 폴링                                   |
| 무한스크롤                            | `useInfiniteQuery` + `hasNext`                           |
| SSR 화면을 다시 그려야 하는 쓰기      | server action + `revalidatePath`                         |
| 전역 UI 상태                          | Zustand (서버 데이터는 절대 저장 X)                      |

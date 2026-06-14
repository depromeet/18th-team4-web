# 요약 페이지 리디자인 수정 Plan

> 상태: 2026-06-05 기준 확정사항 반영
> 대상 화면: `/summary/[summaryId]`
> 핵심 결정: 공통 `TabView` 사용, URL 탭 상태 지원, `?tab=chat` 진입 시 메시지 SSR, 편집 기능과 세부 배경 디자인은 이번 PR 제외

## 0. 참고 기준

이 문서는 구현 계획만 다룬다. 다른 plan 문서는 언제든 없어질 수 있으므로 참고 링크를 걸지 않는다. 참고가 필요한 경우 아래 `docs/specs` 문서만 기준으로 둔다.

| 문서                                                                 | 참고 내용                                          |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| [`../specs/03-routing.md`](../specs/03-routing.md)                   | `/summary/[summaryId]` 라우팅과 search params 처리 |
| [`../specs/04-components.md`](../specs/04-components.md)             | 공통 컴포넌트 사용 원칙                            |
| [`../specs/07-api-layer.md`](../specs/07-api-layer.md)               | 요약/메시지 API 계층                               |
| [`../specs/08-state-management.md`](../specs/08-state-management.md) | TanStack Query 기반 클라이언트 상태                |
| [`../specs/09-styling.md`](../specs/09-styling.md)                   | Tailwind/token 스타일 기준                         |
| [`../specs/13-testing.md`](../specs/13-testing.md)                   | 검증 기준                                          |

## 1. 이번 PR 범위

### 포함

- `/summary/[summaryId]` 화면을 `요약` / `AI 채팅` 탭 구조로 변경한다.
- 이미 추가된 공통 `TabView`를 사용한다.
- URL 탭 상태를 처리한다.
  - `/summary/123`: 기본 `summary` 탭
  - `/summary/123?tab=summary`: `summary` 탭
  - `/summary/123?tab=chat`: `chat` 탭
- `?tab=chat`으로 서버 진입한 경우 AI 채팅 메시지를 SSR 초기 데이터로 내려준다.
- 기본 진입이 `summary` 탭인 경우 AI 채팅 메시지는 클라이언트에서 `chat` 탭 활성화 시 가져온다.
- `SummaryResult`는 `title`과 `body`를 직접 받아 렌더하도록 단순화한다.
- 기존 흰 카드 형태의 `SummaryChatHistory`는 탭 패널 안에서 **`/chat`과 동일한 채팅 리스트 디자인**(사용자 메시지 시간·마지막 AI 아바타 포함)으로 대체한다.

### 제외

- `편집` 기능과 헤더의 `편집` 버튼 노출은 이번 PR에서 제외한다. 추후 별도 PR에서 진행한다.
- `quote` 렌더링은 이번 디자인에서 제외한다. API 필드는 유지하되 UI에는 표시하지 않는다.
- 요약 데이터 모델 변경은 하지 않는다. 현재 `{ title, body, quote }`를 유지한다.
- AI 채팅 실시간 입력창/composer 전환은 하지 않는다. (읽기 전용 — `/chat`의 입력 footer는 제외)
- 이전 요약 디자인의 라디얼 글로우 그래디언트와 이를 위한 `?color=` 쿼리는 **제거**한다(새 디자인은 흰색/플랫 배경 — §3.7). 단 그 위에 올릴 **새 배경 디자인**은 이번 PR에서 판단하지 않는다.

## 2. 현재 코드 As-Is

### 2.1 라우트

- `src/app/summary/[summaryId]/page.tsx`는 `params.summaryId`와 `searchParams.color`만 파싱한다.
- 탭 상태는 URL에 반영되어 있지 않다.
- 서버에서 가져오는 초기 데이터는 `getSummary(summaryId)`뿐이다.

### 2.2 컨테이너

- `src/components/pages/Summary/Container.tsx`가 한 화면에 아래 순서로 렌더한다.
  - `SummaryHeader`
  - `SummaryResult`
  - `SummaryChatHistory`
- `useGetMessages(sessionId)`는 페이지 진입 시 항상 실행된다.
- 메시지 매핑은 `id`, `role`, `content`만 `ChatMessage`로 변환한다.
- `createdAt`은 API에는 있으나 현재 UI 모델에는 포함하지 않는다.

### 2.3 요약 결과

- `SummaryResult`는 `sections: { heading, body }[]`를 받는다.
- `Container`의 `toSections(data)`가 `data.title`을 첫 섹션 heading으로 넣고, `data.quote`가 있으면 `인용` 섹션을 추가한다.
- 고정 문구 `요약을 완성했어요`가 상단에 렌더된다.

### 2.4 AI 채팅 기록

- `SummaryChatHistory`는 흰 카드, `대화 기록` 제목, 구분선, `이전 대화 더 보기` 버튼을 포함한다.
- 내부 메시지는 기존 `Chat` 버블 컴포넌트를 사용한다.

### 2.5 헤더

- `SummaryHeader`는 `HEADER_VARIANT.BACK`만 사용한다.
- 공통 `Header`의 우측 CTA는 `CHAT` variant의 `요약하기`에만 묶여 있다.

### 2.6 공통 탭

- `src/components/common/TabView/TabView.tsx`가 이미 존재한다.
- `TabItem`은 `{ value, label, count?, content }` 구조다.
- `count`는 optional이므로 요약 탭에서는 넘기지 않으면 된다.
- controlled `value` / `onValueChange`를 지원하므로 URL 탭 상태와 연결할 수 있다.

## 3. To-Be

### 3.1 URL 탭 정책

탭 값은 `summary | chat` 두 가지로 제한한다. **URL에는 항상 `?tab=`이 유지된다** — bare/유효하지 않은 진입은 로드 시 `?tab=summary`로 정규화한다.

| URL                        | 초기 탭            | URL 정규화              | 서버 메시지 prefetch |
| -------------------------- | ------------------ | ----------------------- | -------------------- |
| `/summary/123`             | `summary`          | `?tab=summary`로 정규화 | 안 함                |
| `/summary/123?tab=summary` | `summary`          | 그대로                  | 안 함                |
| `/summary/123?tab=chat`    | `chat`             | 그대로                  | 함                   |
| `/summary/123?tab=invalid` | `summary` fallback | `?tab=summary`로 정규화 | 안 함                |

구현 방향:

- `page.tsx`에서 `searchParams` 타입을 `Promise<{ tab?: string | string[] }>`로 확장한다. Next 16 기준으로 `searchParams`는 Promise이며, URL query 값은 배열로 들어올 수 있으므로 normalize한다. (`color` 쿼리는 그래디언트와 함께 제거됨 — §3.7.)
- `parseTab(raw)`를 추가해 `summary | chat`만 허용하고, 배열/그 외 값은 `summary`로 처리한다.
- `SummaryContainer`에 `initialTab`을 전달한다.
- `initialTab === 'chat'`인 경우 서버에서 첫 페이지 메시지를 가져와 `initialMessages` 또는 TanStack Query hydration용 데이터로 전달한다.
- 서버 메시지 fetch는 **이미 있는 인프라를 미러링**한다. `page.tsx`가 이미 서버에서 `getSummary(summaryId)`를 호출해 `initialSummary`로 내려주고, 주요 API는 `user_session` 쿠키 기반이므로 서버용 `messages.server.ts`를 추가해 `publicHttp`로 동일 엔드포인트(`ENDPOINTS.AI_CHAT.getMessages`)를 호출한다. **백엔드 변경 없음.**

### 3.2 탭 UI

- 신규 로컬 탭 구현을 만들지 않고 공통 `TabView`를 사용한다.
- `tabs`는 아래 구조로 구성한다.

```tsx
[
  { value: 'summary', label: '요약', content: <SummaryResult ... /> },
  { value: 'chat', label: 'AI 채팅', content: <SummaryChatPanel ... /> },
]
```

- `count`는 넘기지 않는다.
- **탭 바도 헤더처럼 상단 고정**한다(§3.6의 내부 스크롤 레이아웃 안에서). 공통 `TabView`에 opt-in `stickyHeader` prop을 추가해 tablist를 `sticky top-0 z-10 bg-background-primary-white`로 고정한다. (미전달 시 동작 동일 — Mypage 등 기존 사용처 영향 없음.)
- `value`는 `Container`의 탭 상태와 연결한다.
- `onValueChange`에서 URL search param을 갱신한다.
  - 탭 클릭은 서버 재요청 없이 클라이언트 상태와 URL만 동기화해야 하므로 `window.history.replaceState`를 사용한다(히스토리 오염 방지).
  - **탭 전환 시 항상 `?tab=<탭>`을 유지한다**(`summary`→`?tab=summary`, `chat`→`?tab=chat`).
  - 최초 진입에 `tab`이 없거나 유효하지 않으면 마운트 시 `?tab=summary`로 정규화한다.
  - 이 문서의 필수 조건은 위 URL들이 모두 올바르게 동작하고, 주소창에 항상 `?tab=`이 보이는 것이다.

### 3.3 메시지 fetch 정책

`?tab=chat` 진입:

- 서버에서 메시지 첫 페이지를 가져온다.
- 클라이언트 `useGetMessages`에는 서버 초기 데이터를 연결하거나, 동일 query key에 hydrate한다.
- 사용자는 첫 렌더에서 AI 채팅 탭과 메시지를 볼 수 있어야 한다.

`/summary/123` 또는 `?tab=summary` 진입:

- 서버에서는 요약 데이터만 가져온다.
- 메시지는 즉시 가져오지 않는다.
- 사용자가 `AI 채팅` 탭을 활성화하면 클라이언트에서 `useGetMessages`를 enabled 상태로 실행한다.

구현 메모:

- 현재 `useGetMessages`는 `enabled: !!sessionId`로 고정되어 있으므로, `enabled?: boolean` 옵션을 받을 수 있게 확장한다.
- 기존 `refetchOnMount` / `staleTime` 옵션은 유지한다.
- SSR 초기 데이터는 **요약의 `initialSummary` → `useSummary({ initialData })` 패턴을 그대로** 따른다. 즉 `initialMessages`를 받아 동일 query key에 `initialData`로 hydrate한다.

### 3.4 요약 결과

`SummaryResult` props를 아래처럼 바꾼다.

```ts
type Props = {
  title: string;
  body: string;
};
```

렌더링:

- 고정 문구 `요약을 완성했어요`를 제거한다.
- `title`을 상단의 큰 제목으로 표시한다(`headline1-extrabold` / `text-text-default`).
- `body`를 그 아래 본문으로 표시한다(`caption1-medium-reading` / `text-text-description`). `caption1-medium-reading`은 이번에 추가한 타이포 유틸(12px / 500 / line-height 1.5)이다.
- `quote`는 UI에 표시하지 않는다.
- `toSections` 어댑터와 `SummarySection` 타입은 제거한다.

데이터 모델:

- `summary.zod.ts`의 `{ title, body, quote }`는 유지한다.
- 다중 섹션 모델로 승격하지 않는다.

### 3.5 AI 채팅 탭

**`/chat` 페이지와 동일한 채팅 리스트 디자인을 따른다.** (`/chat` 디자인이 머지로 업데이트됨)

- 공통 `Chat` 컴포넌트(`pages/Chat/Chat`)를 그대로 재사용한다 — 요약 탭과 `/chat`이 같은 버블 컴포넌트를 공유한다.
- 렌더링 패턴도 `/chat` Container와 맞춘다: 리스트 `gap-[2.8rem]`, 사용자 메시지에 `time`(`createdAt`→`formatTime`), **마지막 AI 메시지에만 챗봇 아바타**(`showIcon`), 기본 `tone`(테두리 버블).
- 이를 위해 `Container`의 메시지 매핑이 `createdAt`을 보존한다. (초안의 "createdAt 미표시·시간/아바타 제외" 결정은 `/chat` 디자인 추종으로 **뒤집힘**.)
- 흰 카드 아카이브 구조, `대화 기록` 제목, 구분선은 제거한다.
- `이전 대화 더 보기`(상단 로드 버튼)는 유지한다 — `/chat`은 무한스크롤이지만 요약 탭은 버튼 유지(무한스크롤 전환은 별도 작업).
- 빈/로딩/에러(재시도) 상태는 유지한다. 빈 상태 문구는 `아직 나눈 대화가 없어요.`.
- **입력 footer(composer)는 제외** — 요약 탭은 읽기 전용.

컴포넌트 방향:

- `SummaryChatHistory`를 `SummaryChatPanel` 성격으로 재작업하거나 새 컴포넌트로 교체한다.
- props는 최소한 아래 형태를 기준으로 둔다.

```ts
type Props = {
  messages: ChatMessage[];
  hasOlder: boolean;
  isFetchingOlder: boolean;
  onLoadOlder: () => void;
};
```

### 3.6 헤더와 편집

이번 PR에서는 `편집` 버튼을 노출하지 않는다.

- `SummaryHeader`는 뒤로가기만 유지하되, **`/chat`과 동일하게 흰색 배경 + 상단 고정**으로 맞춘다.
  - 배경: `BACK` variant는 회색(`bg-primary-base`)이고 다른 페이지(Register 등)가 공유하므로 variant는 두고, `SummaryHeader`에서 `className="bg-text-white"`로만 override한다.
  - 고정: 루트 `<main overflow-x-hidden>` + body 스크롤 조합에서 `sticky`가 안 붙으므로, `/chat`처럼 `Container`를 `h-dvh flex-col`로 두고 헤더를 고정 자식으로, 콘텐츠(`TabView`)를 내부 `overflow-y-auto` 영역에 둔다.
- 탭별 헤더 액션 토글도 이번 PR에서는 구현하지 않는다.
- 추후 `편집` 기능을 추가할 때는 기존 `CHAT` variant의 `요약하기` disabled/tooltip 로직을 건드리지 않는다.
- 추후 확장 방향은 `Header`에 `rightSlot` 또는 `rightActionLabel/rightAction`을 추가하는 방식으로 잡는다.

### 3.7 배경

이전 요약 디자인의 라디얼 글로우 그래디언트는 새 디자인(흰색/`#f1f2f6` 단색)에 없으므로 **제거**한다.

- `Container`의 그래디언트 레이어와, 그 색을 넘기던 `?color=` 쿼리 스펙을 함께 제거한다. (생산: `SessionList`, 파싱: `page.tsx`, 소비: `Container`. `color`는 그래디언트 전용이었으므로 제거해도 회귀 없음 — `SessionList`의 `ChatCard` 표시용 `color` 변수는 유지.)
- 이제 죽은 `chatCardGradientColor` 맵과 `bg-chat-card-gradient-*` CSS theme 변수도 제거한다.
- 별도 커밋으로 끊는다: `refactor(summary): 이전 디자인 그래디언트와 ?color= 쿼리 제거`.
- 그 위에 올릴 **새 배경 디자인**이 필요해지면 별도 작업으로 둔다.

### 3.8 로딩 / 에러

- 요약 데이터 로딩/에러 정책은 기존 정책을 유지한다.
- `summary` 탭 진입 시 요약 데이터가 없으면 기존 `SummaryLoading`을 보여준다.
- `chat` 탭 진입 시 메시지 SSR이 실패하더라도 요약 데이터 에러와 구분한다.
  - 요약 데이터 실패: 기존처럼 토스트 후 메인으로 이동
  - 메시지 데이터 실패: AI 채팅 탭 안에서 빈 상태 또는 재시도 UI를 보여주는 방향으로 분리

## 4. 영향 파일

| 파일                                                  | 변경 내용                                                                                                                  |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/app/summary/[summaryId]/page.tsx`                | `searchParams.tab` 파싱, `initialTab` 전달, `?tab=chat`일 때 메시지 SSR. **`?color=` 파싱 제거**                           |
| `src/components/pages/Summary/Container.tsx`          | `TabView` 적용, URL 탭 상태 연결, 메시지 lazy fetch 제어, 메시지 매핑에 `createdAt` 보존. **그래디언트·`color` prop 제거** |
| `src/components/pages/Main/SessionList.tsx`           | summary 링크의 `?color=` 쿼리 제거(`color` 변수는 ChatCard용 유지)                                                         |
| `src/components/common/ChatCard/chatCardVariants.ts`  | 죽은 `chatCardGradientColor` 맵 제거                                                                                       |
| `src/components/common/ChatCard/index.ts`             | `chatCardGradientColor` re-export 제거                                                                                     |
| `src/style/global.css`                                | 죽은 `bg-chat-card-gradient-*` theme 변수 제거                                                                             |
| `src/components/pages/Summary/SummaryResult.tsx`      | `sections` 제거, `{ title, body }` props로 단순화                                                                          |
| `src/components/pages/Summary/SummaryChatHistory.tsx` | 흰 카드 아카이브 제거, read-only 채팅 패널로 재작업. **`/chat` 디자인 정렬**(시간·마지막 AI 아바타·`gap-2.8rem`·기본 tone) |
| `src/lib/api/services/messages/messages.service.ts`   | `enabled` 옵션 추가                                                                                                        |
| `src/lib/api/services/messages/messages.server.ts`    | 필요 시 서버 메시지 fetch 추가                                                                                             |
| `src/lib/api/services/messages/index.ts`              | 서버 fetch 추가 시 export                                                                                                  |

변경하지 않는 파일:

- `src/lib/api/services/summary/summary.zod.ts`
- `src/lib/api/services/summary/summary.type.ts`
- `src/lib/api/services/summary/summary.service.ts`
- `src/components/common/Header/Header.tsx` (이번 PR에서 편집 제외이므로 수정하지 않음)
- `src/components/common/Header/headerVariants.ts`

## 5. 구현 체크포인트

각 체크포인트(CP)는 **그 자체로 앱이 컴파일·렌더되는 green 상태**가 되도록 끊었다. 한 CP를 마치면 아래 **점검**을 통과시킨 뒤에만 커밋하고 다음으로 넘어간다. 점검에서 막히면 진행하지 않는다.

**전제 — 백엔드 API 변경 없음.** 데이터 모델을 `{ title, body, quote }`로 유지하기로 했으므로(§3.4) **어떤 CP도 백엔드 스키마 변경을 요구하지 않는다.** 모든 작업(탭 UI·URL 라우팅·데이터 페칭·디자인)은 **기존 엔드포인트** 위에서 이뤄진다. `?tab=chat` SSR도 새 API가 아니라 *기존 메시지 엔드포인트를 서버에서 호출*하는 것이며, 그 인프라(`publicHttp`, `page.tsx`의 서버 `getSummary` + `initialSummary` hydration 패턴)는 **이미 존재**한다(§3.3).

**진행 순서 원칙(2026-06-05 확정): 탭/디자인을 먼저, 라우팅·데이터 로딩 정책을 뒤에.** 가장 눈에 보이고 API 의존이 0인 골격(탭 셸)을 먼저 세운 뒤 각 패널 디자인을 채우고, 마지막에 URL·로딩 정책을 붙인다. 디자인 diff와 로직 diff가 분리돼 리뷰가 쉽다.

- 모든 커밋의 기본 게이트: **`pnpm lint` 통과** + 타입 깨짐 없음(`pnpm build` 또는 `npx tsc --noEmit`).
- 의존성: CP1(셸) → CP2·CP3(각 패널 디자인) → CP4(URL) → CP5(로딩 정책). 앞 CP가 뒤 CP의 전제다.
- 커밋 메시지는 [`../specs/12-git-conventions.md`](../specs/12-git-conventions.md) 컨벤션을 따른다.

### CP1 — 탭 셸 도입 (공통 `TabView` + 디자인, 로컬 상태)

- **목표**: 가장 먼저 **탭 구조와 시각**을 세운다. 패널 내용은 _지금 있는 것을 그대로_ 꽂는다(요약=현 `SummaryResult`, AI 채팅=현 `SummaryChatHistory`). URL·로딩 정책은 아직 건드리지 않는다.
- **변경**: `Container.tsx` — 기존 stacked 렌더(`SummaryResult` + `SummaryChatHistory`)를 공통 `TabView`의 두 패널로 재배치. 활성 탭은 로컬 `useState`(`'summary' | 'chat'`, 기본 `summary`). `count`는 넘기지 않음. 탭 시각은 공통 `TabView`가 제공하는 밑줄 스타일을 그대로 사용한다(§2.6) — 별도 토큰을 덮어쓰지 않는다.
- **점검**
  - [ ] 화면 상단에 `요약` / `AI 채팅` 탭이 보이고, 활성 탭에 밑줄이 표시된다.
  - [ ] `요약` 탭에 기존 요약 결과가, `AI 채팅` 탭에 기존 대화 내용이 나온다(내용은 아직 구 디자인이어도 무방).
  - [ ] 탭 클릭으로 패널이 전환된다(로컬 상태).
  - [ ] `pnpm lint` 통과.
- **커밋**: `feat(summary): 요약/AI 채팅 탭 셸 도입`

### CP2 — 요약 패널 디자인 (`SummaryResult` 단순화)

- **목표**: 요약 탭 내용을 새 디자인으로. `sections`/`quote`/고정 문구를 걷어내고 `{ title, body }`만 직접 렌더(§3.4). **기존 API 필드만 사용 — 모델 변경 없음.**
- **변경**: `SummaryResult.tsx`(props `{ title, body }`, `요약을 완성했어요` 제거, 렌더는 §3.4를 따름), `Container.tsx`(`toSections` 제거, `data.title`/`data.body` 직접 전달), `SummarySection` 타입 제거.
- **점검**
  - [ ] 요약 탭 상단에 `data.title`이 큰 제목으로 표시된다.
  - [ ] 고정 문구 `요약을 완성했어요`가 사라졌다.
  - [ ] `data.body`가 본문으로 표시된다.
  - [ ] `data.quote`는 화면에 보이지 않는다.
  - [ ] `pnpm lint` 통과.
- **커밋**: `refactor(summary): SummaryResult를 title/body 직접 렌더로 단순화`

### CP3 — AI 채팅 패널 디자인 (흰 카드 → read-only 버블 리스트)

- **목표**: AI 채팅 탭 내용을 새 디자인으로. 흰 카드/`대화 기록` 제목/구분선 제거, 기본 채팅 리스트. **기존 `useGetMessages` 데이터 그대로 사용.**
- **변경**: `SummaryChatHistory.tsx`를 read-only 패널 스타일로 재작업(필요 시 `SummaryChatPanel`로 교체). 현재 props `{ messages, hasOlder, isFetchingOlder, onLoadOlder }`는 이미 최종 형태와 같으므로, 이번 CP의 핵심은 props 재설계가 아니라 흰 카드/헤더/구분선 제거와 기본 버블 리스트 정리다. 빈 상태 문구 `아직 나눈 대화가 없어요.`, 기존 `Chat` 버블 재사용, `Container.tsx` 호출부 확인.
- **점검**
  - [ ] 흰 카드/`대화 기록` 제목/구분선이 사라졌다.
  - [ ] 기존 `Chat` 버블로 메시지 리스트가 표시된다.
  - [ ] `이전 대화 더 보기`(상단 로드) 동작이 유지된다.
  - [ ] 빈 상태 문구가 표시된다.
  - [ ] `createdAt`은 UI에 표시되지 않는다.
  - [ ] `pnpm lint` 통과.
- **커밋**: `refactor(summary): 대화 기록 카드를 기본 채팅 패널로 교체`

### CP4 — URL 탭 상태 (`?tab=summary|chat`)

- **목표**: 로컬 탭 상태를 **URL과 동기화**. 순수 라우팅 작업 — API 무관.
- **변경**:
  - `page.tsx`: `searchParams` 타입을 `Promise<{ tab?: string | string[] }>`로 확장, `parseTab`(`summary | chat`만 허용, 배열/그 외 값은 `summary`), `initialTab`을 `SummaryContainer`로 전달.
  - `Container.tsx`: `TabView`를 controlled로(`value`↔`initialTab`/URL), `onValueChange`에서 `window.history.replaceState`로 search param 갱신, **마운트 시 `?tab=<초기탭>`으로 URL 정규화**(히스토리 오염 방지).
  - URL 정규화: 탭 전환·최초 진입 모두 **항상 `?tab=<탭>`을 유지**한다(`summary`→`?tab=summary`, `chat`→`?tab=chat`). bare/invalid 진입은 마운트 시 `?tab=summary`로 정규화.
- **점검**
  - [ ] `/summary/123` → `요약` 탭 활성 + URL이 `?tab=summary`로 정규화된다.
  - [ ] `/summary/123?tab=summary` → `요약` 탭 활성.
  - [ ] `/summary/123?tab=chat` → `AI 채팅` 탭 활성.
  - [ ] `/summary/123?tab=invalid` → `요약` fallback + `?tab=summary`로 정규화된다.
  - [ ] 탭 전환 시 URL이 항상 `?tab=<탭>`으로 갱신된다(요약 탭에서도 `?tab=summary` 유지).
  - [ ] `pnpm lint` 통과.
- **커밋**: `feat(summary): URL 기반 탭 상태(?tab=summary|chat) 지원`

### CP5 — 메시지 로딩 정책 (lazy fetch + `?tab=chat` SSR)

- **목표**: 메시지를 **필요할 때만** 가져온다. `summary` 진입 = 미호출, `chat` 탭 활성 = 클라이언트 fetch, `?tab=chat` 서버 진입 = SSR 초기 데이터. 메시지/요약 에러 분리(§3.8). **모두 기존 엔드포인트 사용.**
- **변경**:
  - `messages.service.ts`: `useGetMessages`에 `enabled?: boolean` 추가(미전달 시 현행). `chat` 탭 활성 시에만 enabled.
  - `messages.server.ts` 신규 + `messages/index.ts` export: 첫 페이지 서버 fetch. **`publicHttp`로 `getSummary` 서버 패턴을 미러링**.
  - `page.tsx`: `?tab=chat`이면 서버 fetch → `initialMessages`로 전달(요약의 `initialSummary` hydration과 동일한 방식).
  - `Container.tsx`: `initialMessages`를 메시지 query에 hydrate, `summary` 탭에서는 메시지 query disabled, 메시지 실패는 탭 내부 빈 상태·재시도로 분리.
  - _폴백_: 서버 인증이 막히면 SSR 없이 클라이언트 fetch로 degrade(URL/탭은 그대로 동작) — 단 `getSummary`가 이미 서버에서 동작하므로 가능성 낮음.
- **점검**
  - [ ] `summary` 탭 진입 시 메시지 API가 초기 렌더에서 호출되지 않는다(Network 확인).
  - [ ] `AI 채팅` 탭 클릭 시 클라이언트에서 메시지를 가져온다.
  - [ ] `/summary/123?tab=chat` 서버 진입 시 첫 메시지 페이지가 SSR 데이터로 표시된다.
  - [ ] 요약 데이터 실패는 토스트 후 메인 이동, 메시지 실패는 탭 내부에서 처리(분리 확인).
  - [ ] `pnpm lint` + `pnpm build` 통과.
- **커밋**: `feat(summary): AI 채팅 탭 메시지 lazy fetch 및 ?tab=chat SSR 적용`

### CP6 — 통합 점검 / QA 체크리스트 (커밋 단위 아님)

문제가 나오면 **해당 CP에 fixup**하거나 작은 `fix` 커밋으로 끊는다.
아래 체크리스트는 **PR 본문의 테스트 항목으로 그대로 사용**한다.

#### UI / 디자인

- [ ] **요약 탭**: 인용 아이콘·고정 문구(`요약을 완성했어요`) 없이 `data.title`(큰 제목, `headline1-extrabold`) + `data.body`(본문)만 표시된다.
- [ ] 요약 본문 타이포가 `caption1-medium-reading`(12px / weight 500 / line-height 1.5) + `text-text-description`(#474a4a)로 렌더된다.
- [ ] **AI 채팅 탭**: 사용자 메시지 = 테두리 버블 + 버블 좌측 시간(예 `02:30 PM`), AI 메시지 = 평문(버블 없음), **마지막 AI 메시지에만** 챗봇 아바타가 보인다.
- [ ] 사용자 버블이 `/chat`과 동일하게 보인다(흰 배경 위 `gray-10` 테두리 + `gray-alpha-10` 채움, 그림자 없음).
- [ ] 요약 페이지 배경이 흰색이다(이전 라디얼 글로우 그래디언트 제거됨).
- [ ] 상단 헤더가 **흰색 + 스크롤해도 고정**, 탭 바도 **스크롤해도 상단 고정**되고 콘텐츠만 스크롤된다.

#### 탭 / URL

- [ ] `/summary/<id>` 진입 → 요약 탭 활성 + 주소창이 `?tab=summary`로 정규화된다.
- [ ] `/summary/<id>?tab=chat` 진입 → AI 채팅 탭이 활성화된다.
- [ ] `/summary/<id>?tab=invalid` → 요약 탭으로 fallback + `?tab=summary`로 교정된다.
- [ ] 탭 전환 시 항상 `?tab=<탭>`이 유지된다(요약 탭으로 전환해도 `?tab=summary`). 새 서버 요청 없이 주소만 바뀐다(`history.replaceState`).

#### 데이터 로딩 (DevTools Network)

- [ ] `summary` 진입 시 메시지 API(`getMessages`)가 초기 렌더에서 호출되지 않는다.
- [ ] `AI 채팅` 탭을 누르면 그때(lazy) 메시지가 호출된다.
- [ ] `?tab=chat`으로 직접(서버) 진입 시 첫 페이지가 SSR 데이터로 즉시 표시된다(탭 클릭 전부터 보임).

#### 에러 분리

- [ ] 요약 데이터 실패 → 토스트 후 메인으로 이동(기존 동작 유지).
- [ ] 메시지 로드 실패 → AI 채팅 탭 안에서 "다시 시도"가 노출된다(메인 이동 X).

#### 회귀

- [ ] 기존 `/chat`의 `요약하기` 동작에 변화가 없다.
- [ ] `/chat` 페이지 시각 회귀가 없다(공유 `Chat` 컴포넌트는 디자인 일치 범위 내 변경).
- [ ] Mypage 등 다른 `TabView` 사용처의 동작에 변화가 없다(`stickyHeader` 미전달이 기본).
- [ ] `data.quote`는 어디에도 노출되지 않는다. 메시지 시간은 `formatTime`된 형태로만 표시되고 원시 `createdAt`은 노출되지 않는다.

#### 정적 검증

- [ ] `pnpm lint` 통과.
- [ ] `pnpm build`(타입체크 포함) 통과.

## 6. 후속 작업

- `편집` 기능과 헤더 우측 액션 추가
- AI 채팅 탭의 시간/아바타/그룹핑 등 세부 디자인 보강
- 탭별 배경 색상/그라디언트 디자인 정리
- AI 채팅 탭 실시간 입력창 전환 여부 결정

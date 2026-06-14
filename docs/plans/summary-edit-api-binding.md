# 요약 편집 API 연결 Plan

> 대상 화면: `/summary/[summaryId]/edit`
> 목적: 퍼블리싱된 요약 편집 화면의 `저장` 액션을 백엔드 수정 API에 연결한다.

## 1. 범위

### 포함

- `PUT /api/v1/ai-chat/sessions/{sessionId}/summary` 연결
- 요청 바디 `{ title: string, body: string }` 전송
- 저장 성공 시 요약 상세 화면으로 복귀
- 저장 실패/유효하지 않은 입력에 대한 최소 UX 처리
- TanStack Query의 요약 캐시 갱신 또는 무효화

### 제외

- 편집 화면 퍼블리싱 변경
- 요약 데이터 모델 확장
- 자동 저장, 임시 저장, 이탈 방지 모달

## 2. 현재 상태

- `SummaryEditContainer`는 `useSummary(summaryId)`로 초기 요약을 불러온다.
- `title`, `body`를 로컬 state로 편집한다.
- `handleSave`는 아직 API 호출 없이 콘솔 로그만 수행한다.
- 라우팅은 `PATH_NAME.summary.edit(summaryId)`와 `/summary/[summaryId]/edit`가 준비되어 있다.

## 3. API 계약

| 항목         | 내용                                      |
| ------------ | ----------------------------------------- |
| Method       | `PUT`                                     |
| Path         | `/ai-chat/sessions/{sessionId}/summary`   |
| 인증         | `user_session` 쿠키                       |
| Request body | `{ title: string, body: string }`         |
| 성공 후      | `/summary/{sessionId}?tab=summary`로 이동 |

`ENDPOINTS`에는 `/api/v1` prefix를 넣지 않는다. 기존 `NEXT_PUBLIC_API_URL`/HTTP 계층이 base URL을 담당한다.

## 4. 구현 계획

1. `summary.zod.ts`에 수정 요청 schema를 추가한다.
   - `UpdateSummaryRequestSchema = z.object({ title: z.string(), body: z.string() })`
   - 필요한 경우 빈 문자열 방지는 UI 레벨에서 먼저 처리한다.

2. `summary.type.ts`에 요청 타입을 export한다.
   - `UpdateSummaryRequest`

3. `ENDPOINTS.AI_CHAT`에 수정 endpoint를 추가한다.
   - `updateSummary: (sessionId: string) => \`/ai-chat/sessions/${sessionId}/summary\``

4. `summary.client.ts`에 API 함수를 추가한다.
   - `updateSummary(sessionId, body)`
   - `publicHttp.put` 또는 기존 HTTP 래퍼 관례에 맞는 `PUT` 호출 사용
   - `user_session` 쿠키는 기존 `httpBase`의 `credentials: 'include'` 흐름을 따른다.

5. `summary.service.ts`에 mutation hook을 추가한다.
   - `useUpdateSummary()`
   - 성공 시 `QUERY_KEY.aiChat.summary(sessionId)`를 invalidate하거나, 응답 데이터가 있다면 cache set

6. `SummaryEditContainer`의 `handleSave`를 mutation에 연결한다.
   - 저장 중 버튼 중복 클릭 방지
   - `title.trim()`/`body.trim()` 기준 빈 값이면 토스트 처리
   - 성공 시 `/summary/{summaryId}?tab=summary`로 이동
   - 실패 시 저장 실패 토스트 표시

## 5. 검증

- 편집 화면 직접 진입 시 기존 요약이 폼에 채워진다.
- 제목/본문 수정 후 저장하면 `PUT` 요청이 `{ title, body }`로 전송된다.
- 저장 성공 후 요약 탭으로 돌아가 수정 내용이 보인다.
- 저장 중 저장 버튼을 반복 클릭해도 중복 요청이 발생하지 않는다.
- 빈 제목 또는 빈 본문 저장 시 API 호출 없이 사용자에게 안내한다.

## 📌 PR 제목

> [FEAT] 요약 페이지 탭 구조 개편 및 편집 API 연동

---

## 🔗 관련 이슈 (Issue)

- Related to #이슈번호

---

## ✅ 작업 내용

- `/summary/[summaryId]` 화면을 `요약` / `AI 채팅` 탭 구조로 개편했습니다.
- `?tab=summary|chat` 기반 URL 탭 상태를 지원하고, 최초 진입/탭 전환 시 URL을 정규화했습니다.
- `?tab=chat` 직접 진입 시 메시지 첫 페이지를 SSR 초기 데이터로 내려주도록 연결했습니다.
- `summary` 탭 진입 시 메시지 API를 호출하지 않고, `AI 채팅` 탭 활성화 시점에만 메시지를 가져오도록 lazy fetch를 적용했습니다.
- `SummaryResult`를 `title`, `body` 직접 렌더 구조로 단순화했습니다.
- 대화 기록 UI를 기존 카드형 섹션에서 읽기 전용 채팅 패널로 변경하고, 로딩/빈 상태/에러/재시도 상태를 추가했습니다.
- 공통 `TabView`에 `stickyHeader` 옵션을 추가해 요약 화면의 상단 고정 탭바를 지원했습니다.
- `/summary/[summaryId]/edit` 편집 화면을 추가하고, 요약 탭에서만 `편집` 링크를 노출했습니다.
- `PUT /ai-chat/sessions/{sessionId}/summary` API를 연결해 제목/본문 저장 기능을 구현했습니다.
- 저장 요청 타입, endpoint, client 함수, `useUpdateSummary` mutation을 추가했습니다.
- 저장 성공 시 요약 query를 invalidate하고 `/summary/{sessionId}?tab=summary`로 이동하도록 처리했습니다.
- 빈 제목/본문 저장 방지, 저장 실패 토스트, 저장 중 버튼 disabled 처리를 추가했습니다.

---

## 🖥️ 테스트 방법

1. `/summary/{sessionId}`에 접속해 `요약` 탭이 활성화되고 URL이 `?tab=summary`로 정규화되는지 확인합니다.
2. `/summary/{sessionId}?tab=chat`에 직접 접속해 `AI 채팅` 탭이 활성화되고 메시지 첫 페이지가 표시되는지 확인합니다.
3. `요약` 탭 최초 진입 시 메시지 API가 호출되지 않고, `AI 채팅` 탭을 눌렀을 때 메시지 API가 호출되는지 확인합니다.
4. 탭 전환 시 페이지 리로드 없이 URL과 화면 상태가 함께 변경되는지 확인합니다.
5. `요약` 탭에서 `편집` 버튼을 눌러 `/summary/{sessionId}/edit`로 이동합니다.
6. 제목과 본문을 수정한 뒤 `저장`을 클릭해 `PUT /ai-chat/sessions/{sessionId}/summary` 요청 바디가 `{ title, body }`로 전송되는지 확인합니다.
7. 저장 성공 후 `/summary/{sessionId}?tab=summary`로 이동하고 수정된 요약이 표시되는지 확인합니다.
8. 제목 또는 본문을 비운 상태로 저장하면 API 호출 없이 토스트가 표시되는지 확인합니다.
9. `pnpm lint`를 실행합니다.
10. `pnpm build`를 실행합니다.

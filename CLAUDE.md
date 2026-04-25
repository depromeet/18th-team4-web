@AGENTS.md
@docs/README.md

# 핵심 룰

상세 규칙은 [`docs/specs/`](./docs/specs/)를 참조하세요.
CLAUDE.md는 작업 중 항상 떠올려야 하는 최소한만 담습니다.

## 금지

- `src/` 외부에 파일 생성 (루트 설정 파일 제외)
- `any` 사용 → `unknown` 또는 정확한 타입
- `useEffect`로 데이터 패칭 → TanStack Query 사용
- `React.FC` 사용 → 명시적 props 타입 + arrow function
- **`interface` 대신 `type` 우선 — 정말 불가피한 경우에만 `interface` 허용**
- **명명 함수 선언 `function foo()` → arrow function `const foo = () => {}`**
- **`import type { … }` 분리 구문 → `import { type … }` 인라인**
- `default export` (페이지 `app/**/page.tsx`와 Container `components/pages/<Page>/index.tsx`에서만 허용)
- 디렉터리 경계 넘는 `../` import → 항상 `@/` alias 사용
- commit 코드의 `console.log` (`console.warn` / `console.error`만 허용)
- `process.env` 직접 접근 → `@/config/env`를 통해서만
- `tailwind.config.ts` 생성·수정 (Tailwind v4는 CSS-first)

## 워크플로

- 작업 전 `node_modules/next/dist/docs/` 확인 (이 Next.js는 학습 데이터와 다를 수 있음 — [`AGENTS.md`](./AGENTS.md))
- 새 의존성 추가 시 PR 설명에 도입 이유 명시
- 브랜치는 `dev`에서 분기, PR 대상도 `dev` (`feature/#이슈번호` 등)
- PR은 최소 2명 approve 후 머지 (셀프 머지 허용)

# Readum Web — Spec 인덱스

이 디렉터리는 Claude Code, Cursor 등 AI 도구와 팀원이 작업 시 참고하는 프로젝트 컨벤션 모음입니다.
각 스펙은 단일 책임을 가지므로, 작업 영역에 해당하는 파일만 골라서 읽으면 됩니다.

## 작업 전 확인 순서

1. 루트 [`/CLAUDE.md`](../CLAUDE.md) → [`/AGENTS.md`](../AGENTS.md) (전역 룰)
2. 작업 영역에 해당하는 아래 스펙
3. `node_modules/next/dist/docs/` (이 프로젝트의 Next.js는 학습 데이터와 다를 수 있음)

## 스펙 목록

| # | 파일 | 다루는 영역 |
| --- | --- | --- |
| 01 | [01-tech-stack.md](./specs/01-tech-stack.md) | 기술 스택, 인프라(Amplify), 환경 변수 |
| 02 | [02-directory-structure.md](./specs/02-directory-structure.md) | `src/` 폴더 구조와 import alias |
| 03 | [03-routing.md](./specs/03-routing.md) | App Router 페이지 책임 범위 |
| 04 | [04-components.md](./specs/04-components.md) | `common`/`pages` 컴포넌트 패턴, Container, cva |
| 05 | [05-assets.md](./specs/05-assets.md) | SVG/WEBP/아이콘 관리 규칙 |
| 06 | [06-constants.md](./specs/06-constants.md) | `PATH_NAME`, `QUERY_KEY`, `ENDPOINTS` |
| 07 | [07-api-layer.md](./specs/07-api-layer.md) | `lib/api`: http, services, types, schemas |
| 08 | [08-state-management.md](./specs/08-state-management.md) | Zustand, TanStack Query 사용 규칙 |
| 09 | [09-styling.md](./specs/09-styling.md) | Tailwind v4 (CSS-first) |
| 10 | [10-hooks.md](./specs/10-hooks.md) | 커스텀 훅 작성 규칙 |
| 11 | [11-coding-conventions.md](./specs/11-coding-conventions.md) | 임포트, 타입, props, 네이밍 |
| 12 | [12-git-conventions.md](./specs/12-git-conventions.md) | 브랜치, 커밋, PR, 이슈 템플릿 |
| 13 | [13-testing.md](./specs/13-testing.md) | 테스트 컨벤션 |

## 스펙 작성/갱신 규칙

- 단일 책임을 유지합니다. 두 영역에 걸치는 규칙은 각각의 스펙에서 짧게 언급하고 원본 위치를 링크합니다.
- 결정/규칙을 먼저 쓰고, 이유와 예시를 뒤에 붙입니다.
- 코드 예시에는 GOOD / BAD 라벨을 명시합니다.
- 컨벤션이 바뀌면 PR로 스펙을 갱신하고 영향받는 모든 스펙의 cross-link를 함께 점검합니다.

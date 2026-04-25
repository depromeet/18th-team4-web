# 01. Tech Stack & Infrastructure

## 스택

| 구분 | 선택 |
| --- | --- |
| Language / Framework | **Next.js 15 (App Router)** + **TypeScript** |
| 서버 상태 / Fetch | **TanStack Query v5** + Next.js Native Fetch |
| 클라이언트 상태 / 폼 | **Zustand v5** + React Hook Form |
| 스타일링 | **Tailwind CSS v4** (CSS-first) |
| 인터랙션 | Framer Motion |
| 패키지 매니저 | **pnpm** |
| 테스트 | Vitest + Testing Library |
| 인프라 | AWS Amplify (Managed Hosting) |

## 도입 예정

Jest / Sentry / Jira or Linear / Husky / GA / Storybook / Design System — 필요 시점에 채택.

## 배포 / CI·CD

- 호스팅: **AWS Amplify** (Managed Hosting)
- CI/CD: Amplify 내장 Git-based CI/CD
  - `main` 브랜치 Push/Merge 시 자동 빌드 + 전 세계 엣지 로케이션 배포
  - 별도의 CloudFront 캐시 무효화(Invalidation) 작업 불필요 — 즉시 반영
- 작업 흐름: `feature/*` / `chore/*` / `fix/*` / `docs/*` / `refactor/*` / `style/*` → PR → `dev` → 릴리즈 시 `main` (릴리즈 노트로 관리)

## 환경 변수

- 파일 분리: `.env.production`, `.env.development`
- **`process.env`에 직접 접근 금지** → 반드시 `@/config/env`를 통해 사용
- 새 환경 변수 추가 시 PR 설명에 사용처와 기본값(없는 경우 명시) 기재

## ⚠️ Next.js 버전 주의

이 프로젝트의 Next.js는 학습 데이터와 다를 수 있습니다(브레이킹 체인지 가능).
코드를 작성하기 전에 **`node_modules/next/dist/docs/`의 관련 가이드를 먼저 읽고** deprecation notice를 확인하세요. (전역 룰: [`/AGENTS.md`](../../AGENTS.md))

# 13. Testing

## 도구

- **Vitest** + **Testing Library** (`@testing-library/react`)
- globals 활성화: `describe` / `it` / `expect`를 별도 import 없이 사용
- API 모킹: 현재는 `vi.mock()` 사용. **MSW 도입 검토 중.**

## 파일 위치 / 명명

- 테스트 파일은 **테스트 대상 파일과 동일 위치**에 둡니다.
- 확장자: `*.test.ts` / `*.test.tsx`

```
components/common/Button/
├── Button.tsx
└── Button.test.tsx
```

## 커버리지 목표

- `src/lib/api/services/`: ≥ 70%
- `src/lib/utils.ts` 등 utils: ≥ 70%

(전역 강제 기준은 아니며, 도메인별 PR 리뷰에서 함께 점검합니다.)

## 작성 규칙

- 컴포넌트 테스트는 사용자 관점의 인터랙션을 중심으로 작성합니다 (Testing Library의 `getByRole`, `findByText` 등).
- 외부 API/모듈은 `vi.mock()`으로 격리합니다.
- 테스트 데이터는 가능한 한 [`src/lib/mocks/`](./07-api-layer.md)의 mock에서 가져옵니다 — 중복된 fixture를 만들지 않습니다.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('클릭 이벤트가 호출된다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);

    await userEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

## 추후 도입 예정

- **MSW** — `vi.mock()` 대신 네트워크 레벨의 모킹으로 마이그레이션 검토.
- **Playwright** 등 E2E 도구 — 별도 논의 후 도입 시점 결정.

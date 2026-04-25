# 04. Components (`src/components/`)

```
components/
├── common/             # 어디서든 재사용되는 UI 단위
│   └── Button/
│       ├── Button.tsx
│       ├── LinkButton.tsx
│       ├── buttonVariants.ts
│       └── index.ts
└── pages/              # 페이지별 도메인 컴포넌트
    ├── Main/
    │   ├── Body.tsx
    │   └── index.tsx   # Container
    └── Register/
        └── index.tsx
```

## common — 공통 컴포넌트

- 단일 파일로 충분하면 폴더 없이 `*.tsx` 한 개로 둡니다.
- 변형(Variant)/사이즈가 늘거나 파생 컴포넌트(`LinkButton` 등)가 추가될 때 폴더 구조로 승격합니다.
- `cn` 사용은 **공통 컴포넌트라면 필수**. `cva`(class-variance-authority)는 권장.

### Button + cva 예시

```tsx
// Button.tsx
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib';
import { ButtonSize, ButtonVariant, buttonVariants } from './buttonVariants';

type Props = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
  };

export const Button = (props: Props) => {
  const { variant, size, className } = props;
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
```

```tsx
// LinkButton.tsx
import { type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ButtonSize, ButtonVariant, buttonVariants } from './buttonVariants';

type Props = React.ComponentProps<'a'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
    href: string;
  };

export const LinkButton = (props: Props) => {
  const { variant, size, className } = props;
  return <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
```

```ts
// buttonVariants.ts
import { cva } from 'class-variance-authority';

export type ButtonVariant = 'default';
export type ButtonSize = 'default';

export const buttonVariants = cva('', {
  variants: {
    variant: { default: '' },
    size: { default: '' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
```

### 공통 승격 정책

> "여러 페이지에서 공통으로 쓰이는 경우 어디에 두어야 하나?"

현재 페이지 수가 적기 때문에 FSD처럼 기능 단위로 미리 분리하지 않습니다.
PR에서 팀원에게 충분히 설명하고, 자주 들어간다고 판단되면 `common/`으로 승격합니다.
이때 컴포넌트 상단 주석에 사용 의도(Description)를 남깁니다.

## pages — 페이지 컴포넌트

페이지별로 하위 폴더를 만들고, **`index.tsx`가 Container** 역할을 합니다.

### Container Pattern

`pages/<Page>/index.tsx`는:
- 같은 폴더의 하위 컴포넌트를 조합해 디자인을 완성합니다.
- 페이지에서 받은 `params` / `searchParams`를 받아 하위에 데이터를 내립니다.
- **데이터 요청을 가능한 한 여기서 끝내고** 서버 컴포넌트로 유지합니다.
- 그 결과 hydration이 필요한 스크립트는 모두 하위 클라이언트 컴포넌트로 분산됩니다.

```tsx
// 단순 Container
import Link from 'next/link';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';

export default function MainContainer() {
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center">
      <div className="w-full max-w-sm bg-zinc-50 flex flex-col min-h-screen">
        <MainBody />
        <section className="px-6 pb-10">
          <Link href={PATH_NAME.register.list()}>
            <button className="w-full h-14 bg-zinc-900 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-zinc-700 transition-colors">
              30초 만에 시작하기
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
```

```tsx
// 데이터 fetch + 분기를 포함한 Container
import { getCounsellingReservationDetail } from '@/lib';
import Step1Container from './Step1';
import Step2Container from './Step2';

interface Props {
  searchParams: SearchParams;
}

export default async function MypageDetailContainer({ searchParams }: Props) {
  const { data } = await getCounsellingReservationDetail({ reservationId: Number(searchParams.id) });
  const newSearchParams = { ...searchParams, page: searchParams.page || 1 };
  const step = (newSearchParams as SearchParams).step;

  if (data.counsellingType === '1단계 정책상담') {
    if (step === 'second') return <Step2Container data={data} searchParams={newSearchParams} />;
    return <Step1Container data={data} searchParams={newSearchParams} />;
  }

  if (data.counsellingType === '2단계 정책참여') {
    return <Step2Container data={data} searchParams={newSearchParams} />;
  }
}
```

## DO / DON'T

- ✅ 최상위 export 컴포넌트는 **named function declaration**(arrow 지양). default export는 페이지(`page.tsx`)와 Container(`pages/<Page>/index.tsx`)에 한해 허용.
- ✅ Props 인터페이스는 컴포넌트 위에 선언, 명칭은 `Props` (또는 외부 노출 시 `[ComponentName]Props`).
- ✅ Props는 `props` 파라미터로 받고 함수 본문에서 구조분해. → [11-coding-conventions.md](./11-coding-conventions.md#props-처리)
- ❌ `React.FC` 사용 금지 — 명시적 props 인터페이스 + function declaration 사용.
- ❌ `useEffect`로 데이터 패칭 금지 → TanStack Query 사용. → [08-state-management.md](./08-state-management.md)

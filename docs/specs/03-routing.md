# 03. Routing (`src/app/`)

> Next.js App Router 기준. 파일 경로 자체가 라우팅 경로가 됩니다. (예: `/blog/[slug]`)
> Next.js 공식: <https://nextjs-ko.org/docs/app/building-your-application/routing>

## 페이지의 책임 (단 3가지)

`src/app/**/page.tsx`는 아래 세 가지만 담당합니다. **그 외 로직 작성 금지.**

1. **컴포넌트 import 후 렌더링.** 컴포넌트에 영향을 주는 로직을 페이지에서 작성하지 않습니다.
2. **`metadata` 관리.** Next.js는 서버에서 HTML 자체를 내리므로 `generateMetadata`로 SEO 정보를 정의합니다.
3. **`params` / `searchParams` 수신 후 하위 Container로 전달.**

## 기본 페이지

```tsx
// src/app/page.tsx
import { type Metadata } from 'next';
import { MainContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Readum',
    description: 'Readum:사유하는 독서가인 당신을 위해',
  };
};

const MainPage = () => {
  return <MainContainer />;
};

export default MainPage;
```

## `params` / `searchParams` 처리

`params` / `searchParams`는 `Promise`로 들어오므로 페이지에서 **resolve 후** 하위로 내립니다.

```tsx
import MypageDetailContainer from '@/components/pages/mypage/(apply)/detail';

export type SearchParams = {
  id: string;
  page: number;
  mode: 'create' | 'edit' | 'resubmit';
  step: 'first' | 'second' | 'third';
  view?: 'participation' | 'not-participation';
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async (props: Props) => {
  const { searchParams } = props;
  const resolvedSearchParams = await Promise.resolve(searchParams);

  return <MypageDetailContainer searchParams={resolvedSearchParams} />;
};

export default Page;
```

## DO / DON'T

- ✅ `default export`는 페이지(`page.tsx`)와 Container(`components/pages/<Page>/index.tsx`)에서만 허용. 다른 곳에서는 named export 사용.
- ✅ 페이지/Container도 **arrow function**으로 작성하고 마지막 줄에서 `export default Foo`로 내보냄.
- ✅ 타입 import는 `import { type Metadata } from 'next'`처럼 인라인 형식 사용.
- ✅ 데이터 fetch는 가능하면 페이지가 아닌 **Container 컴포넌트**에서 마무리. → [04-components.md](./04-components.md#container-pattern)
- ✅ 페이지는 서버 컴포넌트로 유지. 클라이언트 코드가 필요하면 하위 컴포넌트로 분산.
- ❌ 페이지에서 직접 상태 관리, 조건부 렌더링 분기, fetch 호출을 작성하지 않습니다.
- ❌ `function Page() {}` 같은 명명 함수 선언, `interface` 사용 금지.

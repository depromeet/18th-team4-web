import { TabView } from '@/components';

const Panel = (props: { children: string }) => (
  <div className="body1-medium px-[2.4rem] py-[4rem] text-text-default">{props.children}</div>
);

export const MypageContainer = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <TabView
        defaultValue="registered"
        tabs={[
          {
            value: 'registered',
            label: '등록된 책',
            count: 13,
            content: <Panel>등록된 책 콘텐츠</Panel>,
          },
          {
            value: 'records',
            label: '감상 기록',
            count: 24,
            content: <Panel>감상 기록 콘텐츠</Panel>,
          },
        ]}
      />
    </div>
  );
};

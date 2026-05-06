'use client';

import { useRouter } from 'next/navigation';
import { Header, HEADER_VARIANT } from '@/components';
import { SummaryCard, type SummarySection } from './SummaryCard';

const MOCK_SECTIONS: SummarySection[] = [
  {
    heading: '마법 세계의 향수',
    body: '오랜만에 다시 읽으니, 어릴 적 설레었던 마음이 되살아나는 듯했습니다. 호그와트의 입학 편지를 기다리던 순수한 시절의 제가 떠올랐습니다.',
  },
  {
    heading: '롤링의 필력에 감탄',
    body: '촘촘하게 짜인 플롯과 매력적인 캐릭터들은 여전히 빛났습니다. 롤링 작가의 상상력과 글 솜씨에 다시 한번 감탄했습니다.',
  },
  {
    heading: '인생의 교훈',
    body: '해리포터는 단순한 판타지 소설이 아닌, 용기, 우정, 사랑의 중요성을 일깨워주는 이야기입니다. 제 삶의 지침이 되어주었습니다.',
  },
];

const SummaryContainer = () => {
  const router = useRouter();

  return (
    <>
      <Header variant={HEADER_VARIANT.BACK} onBack={() => router.back()} />
      <section className="flex flex-col">
        <div className="px-[2.4rem]">
          <SummaryCard sections={MOCK_SECTIONS} />
        </div>
      </section>
    </>
  );
};

export default SummaryContainer;

import { Header, HEADER_VARIANT, LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';

const MainContainer = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant={HEADER_VARIANT.HOME} />
      <MainBody />
      <div className="flex flex-col gap-[1.6rem] px-[2.4rem] pb-[2.4rem]">
        <LinkButton href={PATH_NAME.register.list()} size="lg" variant="black" className="rounded-[1.6rem]">
          책 등록하기
        </LinkButton>
        <button type="button" className="body1-bold text-center tracking-[-0.048rem] text-text-caption">
          둘러보기
        </button>
      </div>
    </div>
  );
};

export default MainContainer;

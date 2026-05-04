import { Header, HEADER_VARIANT, LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';

export default function MainContainer() {
  return (
    <>
      <Header variant={HEADER_VARIANT.HOME} />
      <MainBody />

      <section className="flex justify-center py-[2.4rem]">
        <LinkButton href={PATH_NAME.register.list()} size="lg" variant="black">
          시작하기
        </LinkButton>
      </section>
    </>
  );
}

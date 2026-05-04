import { LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { Header } from '@/components';
import { MainBody } from './Body';
import { HEADER_VARIANT } from '@/components';

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

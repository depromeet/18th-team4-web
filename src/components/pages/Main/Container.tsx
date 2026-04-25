import { LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';

export default function MainContainer() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[37.5rem] bg-primary-base flex flex-col min-h-screen">
        <MainBody />

        <section className="flex justify-center py-[2.4rem]">
          <LinkButton href={PATH_NAME.register.list()} size="lg" variant="black">
            시작하기
          </LinkButton>
        </section>
      </div>
    </div>
  );
}

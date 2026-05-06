import { Header, HEADER_VARIANT, LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';
import { EmptyRecordsBody } from './EmptyRecordsBody';
import { MainFooter } from './Footer';
import { RecordsBody } from './RecordsBody';

const hasBook = true;
const hasRecords = true;

export const MainContainer = () => {
  if (!hasBook) {
    return (
      <div className="flex min-h-dvh flex-col">
        <MainBody />
        <div className="flex flex-col gap-[1.6rem] px-[2.4rem] pb-[2.4rem]">
          <LinkButton
            href={PATH_NAME.register.list()}
            size="lg"
            variant="black"
            className="rounded-[1.6rem]"
          >
            책 등록하기
          </LinkButton>
          <button
            type="button"
            className="body1-bold text-center tracking-[-0.048rem] text-text-caption"
          >
            둘러보기
          </button>
        </div>
      </div>
    );
  }

  if (!hasRecords) {
    return (
      <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
        <Header variant={HEADER_VARIANT.HOME} />
        <EmptyRecordsBody />
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <RecordsBody />
      <div className="mt-[10.2rem]" />
      <MainFooter />
    </div>
  );
};

import { ChatCard, CHAT_CARD_COLOR, CHAT_CARD_STATUS, Header, HEADER_VARIANT, LinkButton } from '@/components';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';

export default function MainContainer() {
  return (
    <>
      <Header variant={HEADER_VARIANT.HOME} />
      <MainBody />

      <div className="flex flex-col gap-[1.2rem] px-[2rem] py-[2.4rem]">
        <ChatCard
          color={CHAT_CARD_COLOR.TEAL}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          bookmarked
        />
        <ChatCard
          color={CHAT_CARD_COLOR.YELLOW}
          status={CHAT_CARD_STATUS.LOADING}
          date="25.10.10"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.SKY}
          status={CHAT_CARD_STATUS.ERROR}
        />
        
      </div>

      <section className="flex justify-center py-[2.4rem]">
        <LinkButton href={PATH_NAME.register.list()} size="lg" variant="black">
          시작하기
        </LinkButton>
      </section>
    </>
  );
}

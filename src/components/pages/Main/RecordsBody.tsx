import { ChatCard, CHAT_CARD_COLOR, CHAT_CARD_STATUS } from '@/components';

export const RecordsBody = () => {
  return (
    <div className="relative flex flex-1 flex-col justify-end overflow-hidden">
      <div className="relative flex flex-col">
        <ChatCard
          color={CHAT_CARD_COLOR.GREEN}
          status={CHAT_CARD_STATUS.LOADING}
          date="25.10.10"
          className="mb-[-6.4rem]"
        />
        <ChatCard
          color={CHAT_CARD_COLOR.TEAL}
          status={CHAT_CARD_STATUS.DEFAULT}
          date="25.10.10"
          summary="대화한 내용 간단 요약 어쩌구 저쩌..."
          bookmarked
          className="mb-[-6.4rem]"
        />
      </div>
    </div>
  );
};

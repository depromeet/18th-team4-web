export const MODAL_TYPE = {
  DELETE: {
    title: '책을 삭제할까요?',
    content: '관련된 요약과 대화 내용이 모두 삭제돼요.',
  },
  LOGOUT: {
    title: '아직 준비중입니다!',
    content: '현재 로그인 기능은 지원하지 않습니다.',
  },
  WITHDRAW: {
    title: '아직 준비중입니다!',
    content: '현재 로그인 기능은 지원하지 않습니다.',
  },
} as const;

export type ModalType = keyof typeof MODAL_TYPE;

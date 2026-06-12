export const MODAL_TYPE = {
  DELETE: {
    title: '책을 삭제할까요?',
    content: '관련된 요약과 대화 내용이 모두 삭제돼요.',
  },
  LOGOUT: {
    title: '로그아웃 할까요?',
    content: '카카오톡으로 다시 로그인할 수 있어요.',
  },
  WITHDRAW: {
    title: '회원을 탈퇴할까요?',
    content: '등록한 책과 대화 내용이 모두 삭제돼요.',
  },
} as const;

export type ModalType = keyof typeof MODAL_TYPE;

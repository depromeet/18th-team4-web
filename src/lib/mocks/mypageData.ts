// 데이터 페칭 전 임시 목 데이터. 추후 무한 스크롤 기반 API 응답으로 대체 예정.

export type RegisteredBook = {
  userBookId: number;
  bookId: number;
  title: string;
  publishedYear: number;
  publisher: string;
  coverUrl: string;
  chatSessionCount: number;
};

export type RecordItem = {
  id: number;
  bookTitle: string;
  summary: string;
};

export type BookSummary = {
  id: number;
  date: string;
  summary: string;
};

export const MOCK_BOOKS: RegisteredBook[] = Array.from({ length: 13 }, (_, index) => ({
  userBookId: index + 1,
  bookId: index + 101,
  title: '셰익스피어의 영혼을 담아낸 평론집',
  publishedYear: 2024,
  publisher: '고전문학연구',
  coverUrl: '',
  chatSessionCount: [3, 0, 4, 12][index % 4],
}));

export const MOCK_RECORDS: RecordItem[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  bookTitle: '해리포터와 마법사의 돌',
  summary:
    '대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구',
}));

export const MOCK_BOOK_SUMMARIES: BookSummary[] = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  date: '24.01.13',
  summary:
    '대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구 대화한 내용 간단 요약 어쩌구 저쩌구',
}));

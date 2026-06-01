import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/*
 * Tailwind CSS 클래스 병합
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const toLocalDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * ISO 날짜 문자열을 'YY.MM.DD' 형식으로 변환합니다.
 *
 * @param isoDate - ISO 8601 형식의 날짜 문자열 (예: '2026-06-02T10:00:00Z')
 * @returns 'YY.MM.DD' 형식의 문자열. 잘못된 형식인 경우 빈 문자열을 반환합니다.
 *
 * @example
 * formatDate('2026-06-02T10:00:00Z'); // '26.06.02'
 */
export const formatDate = (isoDate: string) => {
  const datePart = isoDate.split('T')[0] ?? '';
  if (datePart.length < 10) return '';
  return datePart.slice(2).replace(/-/g, '.');
};

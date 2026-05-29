import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/*
 * Tailwind CSS 클래스 병합
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const toLocalDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

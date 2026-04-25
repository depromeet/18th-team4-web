import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/*
 * Tailwind CSS 클래스 병합
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

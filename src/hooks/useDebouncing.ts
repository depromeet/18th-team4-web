'use client';

import { useEffect, useRef, useState } from 'react';

type UseDebouncingOptions<T> = {
  onSettled?: (next: T) => void;
};

export const useDebouncing = <T>(
  value: T,
  delayMs: number,
  options?: UseDebouncingOptions<T>,
): T => {
  const { onSettled } = options ?? {};
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
      onSettledRef.current?.(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delayMs]);

  return debouncedValue;
};

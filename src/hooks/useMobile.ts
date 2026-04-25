'use client';

import { useEffect, useState } from 'react';

interface Props {
  kind: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1640,
};

export const useMobile = (props: Props): boolean => {
  const { kind } = props;
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINTS[kind]}px)`);

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [kind]);

  return isMobile;
};

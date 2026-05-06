'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const PageTransition = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <div key={pathname} style={{ animation: 'fade-in 0.5s ease-in-out' }}>
      {children}
    </div>
  );
};

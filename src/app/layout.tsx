import '@/style/global.css';
import { type Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';
import { type ReactNode } from 'react';
import { Background } from '@/assets';
import { PageTransition, QueryProvider } from '@/providers';
import { ToastContainer } from '@/components';

const suit = localFont({
  src: '../../public/fonts/SUIT-Variable.woff2',
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Readum',
  description: '나만의 독서 기록 서비스',
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
};

type Props = {
  children: ReactNode;
};

const RootLayout = (props: Props): React.ReactElement => {
  const { children } = props;

  return (
    <html lang="ko" className={`${suit.variable} antialiased`}>
      <body className="min-h-dvh bg-gray-50">
        <main className="relative mx-auto min-h-dvh w-full max-w-150 overflow-x-hidden bg-primary-base">
          <Image
            aria-hidden="true"
            alt="common background texture"
            src={Background}
            fill
            preload
            sizes="375px"
            className="pointer-events-none object-cover"
          />

          <div className="relative">
            <QueryProvider>
              <PageTransition>{children}</PageTransition>
            </QueryProvider>
          </div>
        
          <ToastContainer />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

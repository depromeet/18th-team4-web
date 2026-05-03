import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import localFont from 'next/font/local';
import '@/style/global.css';

const suit = localFont({
  src: "../../public/fonts/SUIT-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Readum",
  description: "나만의 독서 기록 서비스",
};

type Props = {
  children: ReactNode;
};

const RootLayout = (props: Props): React.ReactElement => {
  const { children } = props;
  return (
    <html lang="ko" className={`${suit.variable} overflow-x-clip antialiased`}>
      <body className="min-h-dvh overflow-x-clip bg-gray-50">
        <main className="mx-auto min-h-dvh w-full max-w-150 overflow-x-clip bg-primary-base">
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

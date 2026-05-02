import { type Metadata } from "next";
import localFont from "next/font/local";
import { type ReactNode } from "react";

const suit = localFont({
  src: "../../public/fonts/SUIT-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Readum",
  description: "나만의 독서 기록 서비스",
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => {
  return (
    <html lang="ko" className={`${suit.variable} antialiased`}>
      <body className="min-h-dvh bg-gray-50">
        <main className="mx-auto min-h-dvh w-full max-w-150 bg-primary-base overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

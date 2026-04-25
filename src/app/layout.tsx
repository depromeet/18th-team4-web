import "@/style/global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-gray-50 flex justify-center">
        <div className="relative w-full max-w-[375px] min-h-dvh bg-primary-base flex flex-col overflow-x-hidden">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

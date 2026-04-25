import "@/style/global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-gray-50 flex justify-center">
        <main className="relative w-full max-w-150 min-h-dvh bg-primary-base flex flex-col overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}

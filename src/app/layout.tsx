import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontSourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Summarist',
  description: 'AI-powered text summarization',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontInter.variable} ${fontSourceCodePro.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

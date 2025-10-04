import { Outfit } from 'next/font/google';
import './globals.css';
import './print.css'; // New import for print styles

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
        <UserProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}

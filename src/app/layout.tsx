import { Outfit } from 'next/font/google';
import './globals.css';
import './print.css'; // New import for print styles

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';

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
        <UserProvider>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
          </UserProvider>
      </body>
    </html>
  );
}

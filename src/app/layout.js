import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from '../components/SessionProvider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZyverAI",
  description: "Track your sales team success",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

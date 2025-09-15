// File: src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Manajemen Data Korda",
  description: "Aplikasi untuk manajemen data santri dan alumni",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Layout ini sekarang hanya kerangka dasar */}
        {children}
      </body>
    </html>
  );
}
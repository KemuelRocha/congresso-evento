import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const geistSans = Roboto_Condensed({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Definindo pesos
});

const geistMono = Roboto({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Congresso de Jovens - 2025",
  description: "Inscrições para o 33 Congresso de Jovens - 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

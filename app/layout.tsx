import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import "./globals.css";

// Roboto: corpo de texto — mais legível em tamanhos pequenos
const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Roboto Condensed: títulos e destaques (hero, contagem regressiva, seções)
const robotoCondensed = Roboto_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Congresso de Jovens 2026",
  description: "Inscrições para o 34º Congresso de Jovens - 2026",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Congresso de Jovens 2026",
    description: "Inscrições para o 34º Congresso de Jovens - 2026",
    images: ["/assets/congresso-2026-01.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

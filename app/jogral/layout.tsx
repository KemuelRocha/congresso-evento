import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscrição — Jogral | Congresso de Jovens 2026",
  description: "Inscreva-se no Jogral do Congresso de Jovens 2026.",
  openGraph: {
    title: "Inscrição — Jogral | Congresso de Jovens 2026",
    description: "Inscreva-se no Jogral do Congresso de Jovens 2026.",
    images: ["/assets/congresso-2026-01.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function JogralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Coram Deo — Aprendizagem cristã e discipulado",
  description: "Teologia acessível e ferramentas modernas para uma vida diante de Deus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${merriweather.variable}`}>
      <body>{children}</body>
    </html>
  );
}

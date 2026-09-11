import type { Metadata, Viewport } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "./components/PwaRegister";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Coram Deo — Aprendizagem cristã e discipulado",
  description: "Teologia acessível e ferramentas modernas para uma vida diante de Deus.",
  applicationName: "Coram Deo",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/pwa-icon.svg",
    apple: "/pwa-icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Coram Deo",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#080D13",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${merriweather.variable}`}>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}

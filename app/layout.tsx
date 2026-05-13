import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "DailyQuiz — escolhas que mudam o futuro",
  description:
    "Um jogo educativo sobre tempo de tela e as consequências das pequenas decisões diárias.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={pressStart.variable}>
      <body className="min-h-screen scanlines">{children}</body>
    </html>
  );
}

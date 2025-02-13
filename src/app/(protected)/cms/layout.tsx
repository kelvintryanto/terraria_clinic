import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TerrariaVet | Rumah Terraria",
  description: "Merawat dengan Cinta, Menjaga dengan Keahlian",
  icons: "/logo_white.png",
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-violet-300 to-white/80`}>{children}</div>;
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/Navbar";
import Footer from "@/components/Footer ";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-violet-300 to-white/80`}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

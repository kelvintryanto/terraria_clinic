import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
=======
import Footer from "@/components/Footer ";
import { NavBar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
>>>>>>> 93d1361ee7792d565ae2f14183e8b616c36ff85b

export const metadata: Metadata = {
  title: "TerrariaVet | Rumah Terraria",
  description: "Merawat dengan Cinta, Menjaga dengan Keahlian",
  icons: "/logo_white.png",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

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

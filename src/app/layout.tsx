import { Toaster } from '@/components/ui/toaster';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: 'TerrariaVet | Rumah Terraria',
  description: 'Merawat dengan Cinta, Menjaga dengan Keahlian',
  icons: '/logo_white.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

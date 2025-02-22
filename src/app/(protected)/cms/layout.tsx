import SidebarCMS from '@/components/cms/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'TerrariaVet | Rumah Terraria',
  description: 'Merawat dengan Cinta, Menjaga dengan Keahlian',
  icons: '/logo_white.png',
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarCMS />
      <main className="flex-1 ml-14 lg:ml-64">
        <div className="flex-1 h-full p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}

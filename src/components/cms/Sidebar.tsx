'use client';

import {
  BookUser,
  Boxes,
  HandCoins,
  Layers2,
  LayoutDashboard,
  LogOut,
  Stethoscope,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '../ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const items = [
  {
    title: 'Dashboard',
    url: '',
    icon: LayoutDashboard,
  },
  {
    title: 'Pelanggan',
    url: '/customer',
    icon: BookUser,
  },
  {
    title: 'Kategori',
    url: '/category',
    icon: Layers2,
  },
  {
    title: 'Produk & Layanan',
    url: '/products',
    icon: Boxes,
  },
  {
    title: 'Diagnosa',
    url: '/diagnose',
    icon: Stethoscope,
  },
  {
    title: 'Invoice',
    url: '/invoice',
    icon: HandCoins,
  },
];

const SidebarCMS = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="none"
        className="w-14 lg:w-64 fixed top-0 left-0 bottom-0 z-30 border-r"
      >
        <SidebarContent className="h-[calc(100vh-4rem)]">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`/cms` + item.url}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="hidden lg:inline-block">
                            {item.title}
                          </span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="lg:hidden bg-black/80 text-white"
                      >
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="absolute bottom-0 left-0 right-0 h-16 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span
                      className="whitespace-nowrap overflow-hidden
                      [@media(max-width:1090px)]:hidden [@media(max-width:1090px)]:group-hover:inline-block
                      [@media(min-width:1091px)]:inline-block"
                    >
                      Logout
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="lg:hidden bg-black/80 text-white"
                >
                  Logout
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};

export default SidebarCMS;

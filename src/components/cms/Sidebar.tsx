import { BookUser, Boxes, HandCoins, Layers2, LayoutDashboard, LogOut, Stethoscope } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "",
    icon: LayoutDashboard,
  },
  {
    title: "Customer",
    url: "/customer",
    icon: BookUser,
  },
  {
    title: "Kategori",
    url: "/category",
    icon: Layers2,
  },
  {
    title: "Produk",
    url: "/products",
    icon: Boxes,
  },
  {
    title: "Diagnosa",
    url: "/diagnose",
    icon: Stethoscope,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: HandCoins,
  },
];

const SidebarCMS = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={`/cms` + item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Logout"}>
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarCMS;

"use client";

import { History, LayoutDashboard, User, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileCard = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: "/profile",
      icon: LayoutDashboard,
      label: "Overview",
    },
    {
      href: "/profile/owner",
      icon: User,
      label: "Profile",
    },
    {
      href: "/profile/history",
      icon: History,
      label: "History",
    },
    {
      href: "/profile/pets",
      icon: List,
      label: "Pet List",
    },
  ];

  return (
    <div className="bg-violet-800/50 backdrop-blur-md rounded-xl border border-violet-500/10 shadow-lg">
      <nav className="flex flex-col gap-1.5 p-2 md:p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all
              ${isActive(item.href) ? "bg-white/10 text-orange-400 shadow-sm" : "text-white hover:bg-white/10 hover:text-orange-400"}
            `}>
            <item.icon
              size={20}
              className="min-w-[20px] md:min-w-[22px] md:w-[22px] md:h-[22px]"
            />
            <span className="hidden md:inline font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ProfileCard;

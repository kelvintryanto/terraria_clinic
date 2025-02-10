"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { BookOpenText, Images, LogIn, Menu, PawPrint, SlidersVertical } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";

export function NavBar() {
  // const [openItems, setOpenItems] = useState({});

  return (
    <>
      <header className="fixed top-0 w-full max-w-screen shadow-sm z-50 py-3 bg-violet-800/70 backdrop-blur-sm">
        <div className="flex items-center w-full justify-between lg:justify-evenly px-3 bg-transparent">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-3 text-white">
            <PawPrint size={32} />
            <div className="font-bold text-xl">
              <span className="text-orange-500">Terraria</span>
              <span className="text-white">Vet</span>
            </div>
          </Link>

          {/* Navigation menu - full width on large screens */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Tentang */}
                <NavigationMenuItem>
                  <Link href={"/layanan"} className={navigationMenuTriggerStyle()}>
                    <PawPrint size={16} className="mr-2" />
                    Tentang
                  </Link>
                </NavigationMenuItem>
                {/* Layanan */}
                <NavigationMenuItem>
                  <Link href={"/layanan"} className={navigationMenuTriggerStyle()}>
                    <SlidersVertical size={16} className="mr-2" />
                    Layanan
                  </Link>
                </NavigationMenuItem>
                {/* Galeri */}
                <NavigationMenuItem>
                  <Link href={"/layanan"} className={navigationMenuTriggerStyle()}>
                    <Images size={16} className="mr-2" />
                    Galeri
                  </Link>
                </NavigationMenuItem>
                {/* Getting Started */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BookOpenText size={16} className="mr-2" />
                    Booking
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <ListItem href="/booking/dokter" title="Dokter">
                        Booking jadwal dokter
                      </ListItem>
                      <ListItem href="/booking/antar-jemput" title="Antar Jemput">
                        Booking jadwal antar jemput
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Athentication */}
          {/* jika login maka tampilkan account yang login, jika belum login maka tampilkan login dan register */}
          <div className="hidden lg:flex items-center gap-5 text-white">
            <Link href={"/login"} className="flex gap-2 items-center hover:bg-slate-200/30 rounded-md hover:cursor-pointer hover:text-accent-foreground py-1 px-3">
              <LogIn size={16} />
              Masuk
            </Link>
            <Link href={"/register"} className="flex gap-2 items-center hover:bg-slate-200/30 rounded-md hover:cursor-pointer hover:text-accent-foreground py-1 px-3">
              Daftar
            </Link>
          </div>

          {/* Mobile navigation menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-5">
              <SheetTitle></SheetTitle>
              <nav className="flex flex-col justify-between h-full">
                <div className="pt-5 space-y-3">
                  <Link href="/tentang" className="flex items-center text-base font-semibold hover:bg-accent py-1 px-2 rounded-md">
                    <PawPrint size={16} className="mr-2" />
                    Tentang
                  </Link>
                  <Link href="/layanan" className="flex items-center text-base font-semibold hover:bg-accent py-1 px-2 rounded-md">
                    <SlidersVertical size={16} className="mr-2" />
                    Layanan
                  </Link>
                  <Link href="/galeri" className="flex items-center text-base font-semibold hover:bg-accent py-1 px-2 rounded-md">
                    <Images size={16} className="mr-2" />
                    Galeri
                  </Link>
                  <Link href="/booking" className="flex items-center text-base font-semibold hover:bg-accent py-1 px-2 rounded-md">
                    <BookOpenText size={16} className="mr-2" />
                    Booking
                  </Link>
                </div>
                <div className="flex justify-between items-end ">
                  <Link href="/login" className="w-[48%]">
                    <Button variant="outline" className="w-full">
                      <LogIn size={16} className="mr-2" />
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" className="w-[48%]">
                    <Button variant="default" className="w-full">
                      Daftar
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a ref={ref} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

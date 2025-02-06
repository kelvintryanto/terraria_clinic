"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { BookOpenText, Images, LogIn, PawPrint, SlidersVertical } from "lucide-react";

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description: "A modal dialog that interrupts the user with important content and expects a response.",
//   },
//   {
//     title: "Hover Card",
//     href: "/docs/primitives/hover-card",
//     description: "For sighted users to preview content available behind a link.",
//   },
//   {
//     title: "Progress",
//     href: "/docs/primitives/progress",
//     description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
//   },
//   {
//     title: "Scroll-area",
//     href: "/docs/primitives/scroll-area",
//     description: "Visually or semantically separates content.",
//   },
//   {
//     title: "Tabs",
//     href: "/docs/primitives/tabs",
//     description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
//   },
//   {
//     title: "Tooltip",
//     href: "/docs/primitives/tooltip",
//     description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
//   },
// ];

export function NavBar() {
  return (
    <>
      <header className="fixed top-0 w-full max-w-screen shadow-sm z-50 py-3 bg-purple-800/30 backdrop-blur-md">
        <div className="flex items-center w-full justify-evenly bg-transparent">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-3 text-white">
            <PawPrint size={32} />
            <h1 className="font-bold text-xl">TerrariaVet</h1>
          </Link>

          {/* Navigation menu */}
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
                      {/* <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/">
                            <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                            <p className="text-sm leading-tight text-muted-foreground">Beautifully designed components built with Radix UI and Tailwind CSS.</p>
                          </Link>
                        </NavigationMenuLink>
                      </li> */}
                      <ListItem href="/docs" title="Dokter">
                        Booking jadwal dokter
                      </ListItem>
                      <ListItem href="/docs/installation" title="Antar Jemput">
                        Booking jadwal antar jemput
                      </ListItem>
                      {/* <ListItem href="/docs/primitives/typography" title="Typography">
                        Styles for headings, paragraphs, lists...etc
                      </ListItem> */}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {/* Components */}
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {components.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}
                {/* Documentation */}
                {/* <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem> */}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Athentication */}
          {/* jika login maka tampilkan account yang login, jika belum login maka tampilkan login dan register */}
          <div className="flex items-center gap-5 text-white">
            <Link href={"/login"} className="flex gap-2 items-center hover:bg-slate-200/30 rounded-md hover:cursor-pointer hover:text-accent-foreground py-1 px-3">
              <LogIn size={16} />
              Masuk
            </Link>
            <Link href={"/register"} className="flex gap-2 items-center hover:bg-slate-200/30 rounded-md hover:cursor-pointer hover:text-accent-foreground py-1 px-3">
              Daftar
            </Link>
          </div>
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

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  BookOpenText,
  LogIn,
  LogOut,
  Menu,
  PawPrint,
  RollerCoaster,
  SlidersVertical,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const response = await fetch("/api/users/me");
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();

    // Listen for auth changes
    window.addEventListener("auth-change", checkSession);
    return () => {
      window.removeEventListener("auth-change", checkSession);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
      });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const AuthSection = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex gap-2 items-center text-white hover:bg-slate-200/30"
            >
              <User size={16} />
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {(user.role === "super_admin" || user.role === "admin") && (
              <DropdownMenuItem asChild>
                <Link href="/cms" className="cursor-pointer">
                  <SlidersVertical className="mr-2 h-4 w-4" />
                  CMS
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Link
          href="/login"
          className="flex gap-2 items-center hover:bg-slate-200/30 rounded-md hover:cursor-pointer hover:text-accent-foreground py-1 px-3"
        >
          <LogIn size={16} />
          Masuk
        </Link>
        <Link
          href="/register"
          className="flex gap-2 items-center hover:bg-slate-200/30 rounded-md hover:cursor-pointer hover:text-accent-foreground py-1 px-3"
        >
          Daftar
        </Link>
      </>
    );
  };

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
                  <Link
                    href="/#tentang"
                    className={navigationMenuTriggerStyle()}
                  >
                    <PawPrint size={16} className="mr-2" />
                    Tentang
                  </Link>
                </NavigationMenuItem>
                {/* Fasilitas */}
                <NavigationMenuItem>
                  <Link
                    href="/#fasilitas"
                    className={navigationMenuTriggerStyle()}
                  >
                    <RollerCoaster size={16} className="mr-2" />
                    Fasilitas
                  </Link>
                </NavigationMenuItem>

                {/* Layanan */}
                <NavigationMenuItem>
                  <Link
                    href="/#layanan"
                    className={navigationMenuTriggerStyle()}
                  >
                    <SlidersVertical size={16} className="mr-2" />
                    Layanan
                  </Link>
                </NavigationMenuItem>

                {/* Booking */}
                {/* <NavigationMenuItem>
                  <Link
                    href="/#booking"
                    className={navigationMenuTriggerStyle()}
                  >
                    <BookOpenText size={16} className="mr-2" />
                    Booking
                  </Link>
                </NavigationMenuItem> */}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Authentication - Desktop */}
          <div className="hidden lg:flex items-center gap-5 text-white">
            <AuthSection />
          </div>

          {/* Mobile navigation menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden bg-transparent hover:bg-slate-200/30 text-white hover:text-primary"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-5 bg-violet-800 border-none"
            >
              <SheetTitle></SheetTitle>
              <nav className="flex flex-col justify-between h-full">
                <div className="pt-5 space-y-3 text-white">
                  <SheetClose asChild>
                    <Link
                      href="/#tentang"
                      className="flex items-center text-base font-semibold hover:bg-slate-200/30 hover:text-primary py-1 px-2 rounded-md"
                    >
                      <PawPrint size={16} className="mr-2" />
                      Tentang
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/#fasilitas"
                      className="flex items-center text-base font-semibold hover:bg-slate-200/30 hover:text-primary py-1 px-2 rounded-md"
                    >
                      <RollerCoaster size={16} className="mr-2" />
                      Fasilitas
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/#layanan"
                      className="flex items-center text-base font-semibold hover:bg-slate-200/30 hover:text-primary py-1 px-2 rounded-md"
                    >
                      <SlidersVertical size={16} className="mr-2" />
                      Layanan
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/#booking"
                      className="flex items-center text-base font-semibold hover:bg-slate-200/30 hover:text-primary py-1 px-2 rounded-md"
                    >
                      <BookOpenText size={16} className="mr-2" />
                      Booking
                    </Link>
                  </SheetClose>
                </div>
                <div className="flex justify-between items-end">
                  {user ? (
                    <div className="w-full space-y-2">
                      <SheetClose asChild>
                        <Link href="/profile" className="w-full">
                          <Button variant="outline" className="w-full">
                            <User size={16} className="mr-2" />
                            Profile
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" className="w-[48%]">
                          <Button variant="outline" className="w-full">
                            <LogIn size={16} className="mr-2" />
                            Masuk
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/register" className="w-[48%]">
                          <Button variant="default" className="w-full">
                            Daftar
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

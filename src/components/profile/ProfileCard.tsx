'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ClockIcon, DogIcon, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ProfileCard = () => {
  const pathname = usePathname();

  // Check if the current path is active or is a child route
  const isActive = (path: string) => {
    if (path === '/profile' && pathname === '/profile') {
      return true;
    }
    return path !== '/profile' && pathname.startsWith(path);
  };

  const links = [
    {
      href: '/profile',
      label: 'Beranda',
      icon: User,
      exact: true,
    },
    {
      href: '/profile/pets',
      label: 'Anjing Saya',
      icon: DogIcon,
    },
    {
      href: '/profile/owner',
      label: 'Profil Saya',
      icon: Users,
    },
    {
      href: '/profile/history',
      label: 'Riwayat',
      icon: ClockIcon,
    },
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-1 md:pb-3 px-2 md:px-4 pt-2 md:pt-4">
        <CardTitle className="text-white md:block hidden">Profil</CardTitle>
        <CardDescription className="text-white/70 md:block hidden">
          Kelola akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1 md:gap-2 p-1 md:p-3">
        <TooltipProvider>
          {links.map((link) => (
            <Tooltip key={link.href} delayDuration={300}>
              <TooltipTrigger asChild>
                <Link href={link.href} className="w-full">
                  <Button
                    variant="ghost"
                    className={`w-full md:justify-start justify-center h-10 md:h-9 px-2 ${
                      isActive(link.href)
                        ? 'bg-white/20 text-white font-medium'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <link.icon className="h-5 w-5 md:h-4 md:w-4" />
                    <span className="md:inline hidden ml-2">{link.label}</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden block z-50">
                {link.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

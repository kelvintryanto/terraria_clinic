'use client';

import { ClockIcon, DogIcon, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

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
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface ProfileCardProps {
  className?: string;
}

const ProfileCard = ({ className }: ProfileCardProps): React.ReactElement => {
  const pathname = usePathname();

  // Check if the current path is active or is a child route
  const isActive = (path: string): boolean => {
    if (path === '/profile' && pathname === '/profile') {
      return true;
    }
    return path !== '/profile' && pathname.startsWith(path);
  };

  const links: NavLink[] = [
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
    <Card
      className={cn(
        'bg-white/10 backdrop-blur-sm border-white/20 flex flex-col h-full',
        className
      )}
    >
      <CardHeader className="pb-1 md:pb-3 px-2 md:px-4 pt-2 md:pt-4 shrink-0">
        <CardTitle className="text-white md:block hidden">Profil</CardTitle>
        <CardDescription className="text-white/70 md:block hidden">
          Kelola akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 md:gap-2 p-1 md:p-3 flex-grow">
        <div className="flex flex-col gap-1 md:gap-2 flex-grow">
          <TooltipProvider>
            {links.map((link) => (
              <Tooltip key={link.href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link href={link.href} className="w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      className={`w-full md:justify-start justify-center h-10 md:h-9 px-2 ${
                        isActive(link.href)
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      <link.icon
                        className="h-5 w-5 md:h-4 md:w-4"
                        aria-hidden="true"
                      />
                      <span className="md:inline hidden ml-2">
                        {link.label}
                      </span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="md:hidden block z-50">
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

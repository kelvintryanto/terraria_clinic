'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ProfileCard = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const links = [
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
    },
    {
      href: '/profile/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile settings</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button
              variant="outline"
              className={`w-full justify-start gap-2 ${
                isActive(link.href)
                  ? 'bg-white/10 text-orange-400 shadow-sm'
                  : 'text-white hover:bg-white/10 hover:text-orange-400'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

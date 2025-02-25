'use client';

import { NavBar } from '@/components/navbar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isCMSRoute = pathname?.startsWith('/cms');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();

        if (data.user) {
          setUser(data.user);

          if (
            isCMSRoute &&
            !['super_admin', 'admin'].includes(data.user.role)
          ) {
            console.log(
              'Client-side redirect: User role not allowed:',
              data.user.role
            );
            router.push('/');
          } else if (isCMSRoute) {
            console.log('Client-side access granted for role:', data.user.role);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        router.push('/login');
      }
    };

    checkSession();
  }, [router, isCMSRoute]);

  // if (loading) {
  //   return (
  //     <div className="flex bg-violet-800 h-screen w-full items-center justify-center">
  //       <Image
  //         src="/loading/dualring.png"
  //         className="animate-spin"
  //         alt="loading..."
  //         width={200}
  //         height={200}
  //       />
  //     </div>
  //   );
  // }

  return user ? (
    <>
      {!isCMSRoute && <NavBar />}
      {children}
      {!isCMSRoute}
    </>
  ) : null;
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex bg-violet-800 h-screen w-full items-center justify-center">
        <Image src="/loading/dualring.png" className="animate-spin" alt="loading..." width={200} height={200} />
      </div>
    );
  }

  return user ? <>{children}</> : null;
}

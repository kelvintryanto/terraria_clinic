"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
}

export function ProfileHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/50 via-violet-800/30 to-purple-900/20 backdrop-blur-xl border border-violet-500/10 shadow-lg shadow-violet-900/20">
      <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative">
          <Avatar className="w-32 h-32 border-4 border-orange-400/50">
            <AvatarImage
              src="/placeholder-avatar.jpg"
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-2xl text-white">{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white/90 hover:bg-white shadow-lg">
            <Edit
              size={14}
              className="text-orange-600"
            />
          </Button>
        </motion.div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col gap-3 md:flex-row text-3xl items-center font-bold text-white">
            <h1>{user?.name}</h1>
            <Link
              href="/owner"
              className="flex items-center gap-1 lg:ml-5 text-base bg-gradient-to-br from-orange-400 to-orange-600 rounded-md py-2 px-4 hover:cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-700">
              <Edit size={16} />
              Edit Profile
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Mail
                size={16}
                className="text-orange-300"
              />
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/50 via-violet-800/30 to-purple-900/20 backdrop-blur-xl border border-violet-500/10 shadow-lg shadow-violet-900/20">
      <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <Skeleton className="w-32 h-32 rounded-full bg-violet-800/50" />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col gap-3 md:flex-row items-center">
            <Skeleton className="h-9 w-48 bg-violet-800/50" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-5 w-64 bg-violet-800/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

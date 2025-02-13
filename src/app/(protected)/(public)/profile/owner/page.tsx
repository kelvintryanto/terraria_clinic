"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import OwnerProfileLoading from "@/components/loading/OwnerProfileLoading";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function OwnerProfilePage() {
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
    return <OwnerProfileLoading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Owner Profile</h2>
        <div className="flex gap-2">
          <ChangePasswordDialog />
          <Link href="/owner">
            <Button
              variant="outline"
              className="gap-2">
              <Edit size={16} />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-orange-300/80 text-sm">Full Name</h3>
              <p className="text-white text-lg">{user?.name}</p>
            </div>
            <div>
              <h3 className="text-orange-300/80 text-sm">Email</h3>
              <p className="text-white text-lg">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-orange-300/80 text-sm">Member ID</h3>
              <p className="text-white text-lg">{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

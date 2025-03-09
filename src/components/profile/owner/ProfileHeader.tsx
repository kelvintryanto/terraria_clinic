'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Edit, Mail, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

export function ProfileHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        // First get the user ID from /api/users/me
        const meResponse = await fetch('/api/users/me');
        const meData = await meResponse.json();

        if (meData.user && meData.user.id) {
          // Then fetch the complete user data by ID
          const userResponse = await fetch(`/api/customers/${meData.user.id}`);
          const userData = await userResponse.json();

          if (userData.customer) {
            setUser({
              id: userData.customer._id || userData.customer.id,
              name: userData.customer.name,
              email: userData.customer.email,
              profileImage: userData.customer.profileImage,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  // Validate profile image
  const hasValidProfileImage =
    user?.profileImage &&
    typeof user.profileImage === 'string' &&
    user.profileImage.trim() !== '' &&
    (user.profileImage.startsWith('http://') ||
      user.profileImage.startsWith('https://'));

  if (!hasValidProfileImage && user?.profileImage) {
    console.warn('Invalid profile image URL format:', user.profileImage);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/50 via-violet-800/30 to-purple-900/20 backdrop-blur-xl border border-violet-500/10 shadow-lg shadow-violet-900/20"
    >
      <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <Avatar className="w-32 h-32 border-4 border-orange-400/50">
            {hasValidProfileImage ? (
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={user?.profileImage || ''}
                  alt={user?.name || 'Profile'}
                  fill
                  unoptimized={true}
                  className="object-cover"
                  priority
                  onError={(e) => {
                    console.error(
                      'Failed to load profile image:',
                      user?.profileImage
                    );
                    // Use fallback avatar
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className =
                      'bg-gradient-to-br from-orange-400 to-orange-600 text-2xl text-white flex items-center justify-center w-full h-full';
                    fallbackDiv.innerText =
                      user?.name?.slice(0, 2).toUpperCase() || '';

                    // Find parent element and replace image with fallback
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                      }
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                />
              </div>
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-2xl text-white">
                {user?.name?.slice(0, 2).toUpperCase() || (
                  <User className="h-10 w-10" />
                )}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Debug image - Hidden in production */}
          {hasValidProfileImage && (
            <div className="hidden">
              <Image
                src={user?.profileImage || ''}
                alt="Debug profile"
                width={50}
                height={50}
                unoptimized={true}
                className=""
              />
            </div>
          )}

          <Link href="/profile/owner">
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white/90 hover:bg-white shadow-lg"
            >
              <Edit size={14} className="text-orange-600" />
            </Button>
          </Link>
        </motion.div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col gap-3 md:flex-row text-3xl items-center font-bold text-white">
            <h1>{user?.name}</h1>
            <Link
              href="/profile/owner"
              className="flex items-center gap-1 lg:ml-5 text-base bg-gradient-to-br from-orange-400 to-orange-600 rounded-md py-2 px-4 hover:cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-700"
            >
              <Edit size={16} />
              Edit Profile
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-orange-300" />
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

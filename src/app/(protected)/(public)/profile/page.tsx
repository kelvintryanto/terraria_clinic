'use client';

import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { ProfileHeader } from '@/components/profile/owner/ProfileHeader';
import { AddPetCard } from '@/components/profile/pet/AddPetCard';
import { PetCard } from '@/components/profile/pet/PetCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const fetchUserDogs = async () => {
    try {
      setLoading(true);
      // Fetch the current user's customer data with cache busting
      const userResponse = await fetch('/api/users/me', {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
        cache: 'no-store',
      });
      const userData = await userResponse.json();

      if (!userData.user || !userData.user.id) {
        throw new Error('Pengguna tidak ditemukan');
      }

      // Fetch the customer data which includes dogs with cache busting
      const customerResponse = await fetch(
        `/api/customers/${userData.user.id}`,
        {
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
          cache: 'no-store',
        }
      );

      if (!customerResponse.ok) {
        throw new Error('Gagal mengambil data pelanggan');
      }

      const customerData = await customerResponse.json();
      setDogs(customerData.customer.dogs || []);
    } catch {
      setError('Gagal memuat data Anda');
    } finally {
      setLoading(false);
    }
  };

  const fetchBreeds = async () => {
    try {
      const response = await fetch('/api/breeds');
      const data = await response.json();
      setBreeds(data);
    } catch {
      // Error silently handled
    }
  };

  // Check for refresh flag on initial load
  useEffect(() => {
    const checkForRefreshFlag = () => {
      if (typeof window !== 'undefined') {
        const shouldRefresh = sessionStorage.getItem('refreshPetData');
        if (shouldRefresh === 'true') {
          sessionStorage.removeItem('refreshPetData');
          fetchUserDogs();
        }
      }
    };

    fetchUserDogs();
    fetchBreeds();

    // Check for refresh flag after a short delay to ensure it's set
    const timeoutId = setTimeout(checkForRefreshFlag, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Add listener for focus events to refresh data when user comes back to this page
  useEffect(() => {
    // Function to refresh data when the window gets focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pathname === '/profile') {
        fetchUserDogs();
      }
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Create a simple polling mechanism to check data freshness
    const intervalId = setInterval(() => {
      if (pathname === '/profile') {
        fetchUserDogs();
      }
    }, 15000); // Poll every 15 seconds while on profile page

    // Cleanup listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full"
    >
      <div className="h-full p-2 sm:p-4">
        <ProfileHeader />

        {/* Tabs Section */}
        <Tabs defaultValue="pets" className="mt-4 sm:mt-8">
          {/* Pets Tab */}
          <TabsContent value="pets" className="m-0">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-violet-500/10 min-w-0"
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 sm:h-5 w-16 sm:w-24 mb-2" />
                        <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mb-2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                          <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
                      <Skeleton className="h-12 sm:h-14" />
                      <Skeleton className="h-12 sm:h-14" />
                    </div>
                    <div className="mt-2 space-y-2">
                      <Skeleton className="h-10 sm:h-12" />
                      <Skeleton className="h-10 sm:h-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-4 sm:p-6 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl">
                <p className="text-red-300">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4">
                {dogs.map((dog) => (
                  <PetCard key={dog._id.toString()} dog={dog} breeds={breeds} />
                ))}
                <AddPetCard />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

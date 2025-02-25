'use client';

import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { PetCard } from '@/components/profile/pet/PetCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PetsPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDogs = async () => {
      try {
        setLoading(true);
        // Fetch the current user's customer data
        const userResponse = await fetch('/api/users/me');
        const userData = await userResponse.json();

        if (!userData.user || !userData.user.id) {
          throw new Error('User not found');
        }

        // Fetch the customer data which includes dogs
        const customerResponse = await fetch(
          `/api/customers/${userData.user.id}`
        );

        if (!customerResponse.ok) {
          throw new Error('Failed to fetch customer data');
        }

        const customerData = await customerResponse.json();
        setDogs(customerData.dogs || []);
      } catch (error) {
        console.error('Error fetching dogs:', error);
        setError('Failed to load your pets');
      } finally {
        setLoading(false);
      }
    };

    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds');
        if (!response.ok) throw new Error('Failed to fetch breeds');

        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchUserDogs();
    fetchBreeds();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <h2 className="text-2xl font-bold text-white">My Pets</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="w-20 h-20 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-300">{error}</p>
        </div>
      ) : dogs.length === 0 ? (
        <div className="text-center p-6 bg-violet-900/20 border border-violet-500/20 rounded-xl">
          <p className="text-white/70">
            You don&apos;t have any pets yet. Add your first pet!
          </p>
          <Link
            href="/profile/pets/add"
            className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-md"
          >
            Add Pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dogs.map((dog) => (
            <Link
              key={dog._id.toString()}
              href={`/profile/pets/${dog._id.toString()}`}
            >
              <PetCard dog={dog} breeds={breeds} />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

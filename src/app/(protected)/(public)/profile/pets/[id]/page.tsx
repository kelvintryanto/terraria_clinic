'use client';

import { formatDogAge } from '@/app/utils/format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Dummy data - in a real app, you'd fetch this based on the ID
const petDetails = {
  id: 1,
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: 3,
  image: '/placeholder-pet.jpg',
  status: ['Vaccinated', 'Healthy'],
  weight: '25 kg',
  birthday: 'March 15, 2021',
  gender: 'Male',
  medicalHistory: [
    { date: '2024-02-15', type: 'Vaccination', notes: 'Annual boosters' },
    { date: '2024-01-10', type: 'Check-up', notes: 'Regular health check' },
  ],
};

export default function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <div className="flex justify-between items-center">
        <Link href="/profile/pets" className="text-white hover:text-orange-400">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            Back to Pets
          </Button>
        </Link>
        <Link href={`/pet?id=${id}`}>
          <Button variant="outline" className="gap-2">
            <Edit size={16} />
            Edit Pet
          </Button>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-24 sm:w-32 h-24 sm:h-32 rounded-xl border-2 border-white/20">
            <AvatarImage
              src={petDetails.image}
              alt={petDetails.name}
              className="object-cover"
            />
            <AvatarFallback>🐕</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {petDetails.name}
              </h2>
              <p className="text-orange-300/80">
                {petDetails.breed} • {formatDogAge(petDetails.age)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/10">
                <p className="text-orange-300/90 text-sm">Weight</p>
                <p className="text-white font-medium">{petDetails.weight}</p>
              </div>
              <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/10">
                <p className="text-orange-300/90 text-sm">Birthday</p>
                <p className="text-white font-medium">{petDetails.birthday}</p>
              </div>
              <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/10">
                <p className="text-orange-300/90 text-sm">Gender</p>
                <p className="text-white font-medium">{petDetails.gender}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Medical History
          </h3>
          <div className="space-y-4">
            {petDetails.medicalHistory.map((record, index) => (
              <div
                key={index}
                className="bg-violet-900/30 rounded-lg p-4 border border-violet-500/10"
              >
                <div className="flex justify-between">
                  <p className="text-orange-300/90">{record.type}</p>
                  <p className="text-white/70">{record.date}</p>
                </div>
                <p className="text-white mt-2">{record.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

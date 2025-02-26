'use client';

import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface PetCardProps {
  dog: Dog;
  breeds: Breed[];
}

export function PetCard({ dog, breeds }: PetCardProps) {
  // Find the breed name from the breedId or use customBreed
  const breedName =
    dog.customBreed ||
    breeds.find((b) => b._id.toString() === dog.breedId?.toString())?.name ||
    'Ras Tidak Diketahui';

  // Format dates
  const formatDate = (date: string | null) => {
    if (!date) return 'Belum Ada Data';
    return format(new Date(date), 'd MMMM yyyy', { locale: id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="group h-full"
    >
      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-3 sm:p-4 md:p-6 border border-violet-500/10 hover:border-orange-400/30 transition-all shadow-lg hover:shadow-orange-900/10 h-full">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-white/20 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-base sm:text-xl">
              {dog.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
              {dog.name}
            </h3>
            <p className="text-orange-300/80 text-xs sm:text-sm truncate">
              {breedName}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
              <span className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs px-2 py-0.5 rounded-full border">
                {dog.sex === 'male' ? 'Jantan' : 'Betina'}
              </span>
              <span className="bg-orange-500/10 text-orange-300 border-orange-500/20 text-xs px-2 py-0.5 rounded-full border">
                {dog.age} Tahun
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90 text-[0.7rem] sm:text-xs mb-0.5">
              Berat
            </p>
            <p className="text-white font-medium">{dog.weight} kg</p>
          </div>
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90 text-[0.7rem] sm:text-xs mb-0.5">
              Warna
            </p>
            <p className="text-white font-medium truncate">{dog.color}</p>
          </div>
        </div>

        <div className="mt-2 space-y-2 text-[0.7rem] sm:text-xs">
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90 mb-0.5">Vaksin Terakhir</p>
            <p className="text-white">{formatDate(dog.lastVaccineDate)}</p>
          </div>
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90 mb-0.5">Obat Cacing Terakhir</p>
            <p className="text-white">{formatDate(dog.lastDewormDate)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

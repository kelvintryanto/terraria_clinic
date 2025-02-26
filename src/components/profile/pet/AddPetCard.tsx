'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function AddPetCard() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="group bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-violet-800/10 backdrop-blur-md rounded-xl p-3 sm:p-4 md:p-6 border border-violet-500/10 hover:border-orange-400/30 transition-all h-full shadow-lg hover:shadow-orange-900/10"
    >
      <Link
        href="/profile/pets/add"
        className="flex flex-col items-center justify-center h-full text-center"
      >
        <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform border border-orange-500/20">
          <Plus size={20} className="text-orange-300 sm:h-6 sm:w-6" />
        </span>
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Tambah Hewan
        </h3>
        <p className="text-white/60 text-xs sm:text-sm mt-1">
          Daftarkan profil hewan peliharaan Anda
        </p>
      </Link>
    </motion.button>
  );
}

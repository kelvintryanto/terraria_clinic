"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function AddPetCard() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="group bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-violet-800/10 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 hover:border-orange-400/30 transition-all h-full shadow-lg hover:shadow-orange-900/10">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-orange-500/20">
          <Plus
            size={24}
            className="text-orange-300"
          />
        </div>
        <h3 className="text-lg font-semibold text-white">Add New Pet</h3>
        <p className="text-white/60 text-sm mt-1">Register your furry friend&apos;s profile</p>
      </div>
    </motion.button>
  );
}

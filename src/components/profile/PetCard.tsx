"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function PetCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="group">
      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 hover:border-orange-400/30 transition-all shadow-lg hover:shadow-orange-900/10">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20 rounded-xl border-2 border-white/20">
            <AvatarImage
              src="/placeholder-pet.jpg"
              alt="Pet"
              className="object-cover rounded-xl"
            />
            <AvatarFallback>🐕</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Buddy</h3>
            <p className="text-orange-300/80 text-sm">Golden Retriever • 3 years</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-orange-500/10 text-orange-300 text-xs px-2 py-1 rounded-full border border-orange-500/20">Vaccinated</span>
              <span className="bg-emerald-500/10 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-500/20">Healthy</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90">Weight</p>
            <p className="text-white font-medium">25 kg</p>
          </div>
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90">Birthday</p>
            <p className="text-white font-medium">Mar 15</p>
          </div>
          <div className="bg-violet-900/30 rounded-lg p-2 border border-violet-500/10">
            <p className="text-orange-300/90">Next Visit</p>
            <p className="text-white font-medium">2w</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

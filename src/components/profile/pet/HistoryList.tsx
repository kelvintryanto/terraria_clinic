"use client";

import { motion } from "framer-motion";
import { Dog as Paw } from "lucide-react";

export function HistoryList() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-violet-900/30 rounded-lg hover:bg-violet-800/30 transition-colors border border-violet-500/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center border border-orange-500/20">
              <Paw
                size={20}
                className="text-orange-300"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-white font-medium">Vaccination - Buddy</h3>
                  <p className="text-white/60 text-sm">March 15, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-medium">Rp 500.000</p>
                  <p className="text-emerald-400 text-sm">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

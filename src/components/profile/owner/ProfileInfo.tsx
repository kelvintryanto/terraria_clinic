"use client";

import { motion } from "framer-motion";

export function ProfileInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 shadow-lg">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 bg-violet-900/30 p-4 rounded-lg border border-violet-500/10">
          <label className="text-sm font-medium text-orange-300/80">Full Name</label>
          <p className="text-lg text-white">John Doe</p>
        </div>
        <div className="space-y-2 bg-violet-900/30 p-4 rounded-lg border border-violet-500/10">
          <label className="text-sm font-medium text-orange-300/80">Email</label>
          <p className="text-lg text-white">john.doe@example.com</p>
        </div>
        <div className="space-y-2 bg-violet-900/30 p-4 rounded-lg border border-violet-500/10">
          <label className="text-sm font-medium text-orange-300/80">Phone</label>
          <p className="text-lg text-white">+62 812-3456-7890</p>
        </div>
        <div className="space-y-2 bg-violet-900/30 p-4 rounded-lg border border-violet-500/10">
          <label className="text-sm font-medium text-orange-300/80">Address</label>
          <p className="text-lg text-white">Jl. Example Street No. 123, Jakarta</p>
        </div>
      </div>
    </motion.div>
  );
}

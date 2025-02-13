"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";

const PetForm = () => {
  return (
    <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 shadow-lg w-full sm:w-2/3 md:w-1/2 lg:1/3 lg:py-8 px-14">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-xl font-bold text-orange-500">Pet Form</h1>

        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <Avatar className="w-32 h-32 border-4 border-orange-400/50">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-2xl text-white">JD</AvatarFallback>
          </Avatar>
          <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white/90 hover:bg-white shadow-lg">
            <Edit size={14} className="text-orange-600" />
          </Button>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full space-y-4 text-white">
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <Input type="text" placeholder="Masukkan nama" className="w-full mt-1 border border-white rounded-lg text-white focus:ring-2 focus:ring-orange-400/50" />
          </div>

          <div>
            <label className="block text-sm font-medium">Jenis Kelamin</label>
            <select className="w-full mt-1 p-2 bg-white/5 border border-white rounded-lg text-white focus:ring-2 focus:ring-orange-400/50" defaultValue="">
              <option disabled value="" className="text-gray-300">
                Pilih salah satu
              </option>
              <option value="jantan" className="text-gray-800">
                Jantan
              </option>
              <option value="betina" className="text-gray-800">
                Betina
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Ras</label>
            <select className="w-full mt-1 p-2 bg-white/5 border border-white rounded-lg text-white focus:ring-2 focus:ring-orange-400/50" defaultValue="">
              <option disabled value="" className="text-gray-300">
                Pilih salah satu
              </option>
              <option value="golden retriever" className="text-gray-800">
                Golden Retriever
              </option>
              <option value="boston terrier" className="text-gray-800">
                Boston Terrier
              </option>
              <option value="tarik db" className="text-gray-800">
                nanti tarik dari mongodb
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tanggal Lahir</label>
            <Input type="date" className="w-full mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium">Berat</label>
            <Input type="number" placeholder="contoh: 15 (kg)" className="w-full mt-1" />
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 font-medium text-white hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-violet-800">
            Simpan Profil
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default PetForm;

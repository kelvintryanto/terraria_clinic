"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/50 via-violet-800/30 to-purple-900/20 backdrop-blur-xl border border-violet-500/10 shadow-lg shadow-violet-900/20">
      <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative">
          <Avatar className="w-32 h-32 border-4 border-orange-400/50">
            <AvatarImage
              src="/placeholder-avatar.jpg"
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-2xl text-white">JD</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white/90 hover:bg-white shadow-lg">
            <Edit
              size={14}
              className="text-orange-600"
            />
          </Button>
        </motion.div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white">John Doe</h1>
          <p className="text-orange-300/80">Proud Pet Parent since 2024</p>
          <div className="flex flex-col md:flex-row gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Mail
                size={16}
                className="text-orange-300"
              />
              john.doe@example.com
            </div>
            <div className="flex items-center gap-2">
              <Phone
                size={16}
                className="text-orange-300"
              />
              +62 812-3456-7890
            </div>
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className="text-orange-300"
              />
              Jakarta, Indonesia
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

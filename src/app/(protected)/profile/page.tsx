"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dog as Paw, History, User } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileHeader } from "@/components/profile/owner/ProfileHeader";
import { PetCard } from "@/components/profile/pet/PetCard";
import { AddPetCard } from "@/components/profile/pet/AddPetCard";
import { HistoryList } from "@/components/profile/pet/HistoryList";
import { ProfileInfo } from "@/components/profile/owner/ProfileInfo";

export default function ProfilePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
      <ProfileHeader />

      {/* Tabs Section */}
      <Tabs defaultValue="pets" className="space-y-6">
        <TabsList className="bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
          <TabsTrigger value="pets" className="gap-2">
            <Paw size={16} />
            Pets
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History size={16} />
            History
          </TabsTrigger>
          <TabsTrigger value="owner" className="gap-2">
            <User size={16} />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Pets Tab */}
        <TabsContent value="pets">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PetCard />
            <AddPetCard />
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <HistoryList />
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="owner">
          <ProfileInfo />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dog as Paw, History, User } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PetCard } from "@/components/profile/PetCard";
import { AddPetCard } from "@/components/profile/AddPetCard";
import { HistoryList } from "@/components/profile/HistoryList";
import { ProfileInfo } from "@/components/profile/ProfileInfo";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen pt-20 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-800/80 via-[#6032A2] to-[#371D5C]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent,rgba(96,50,162,0.2))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-800/10 to-[#371D5C]/30" />
        <div className="absolute top-0 left-0 w-full z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320">
            <path
              fill="#273036"
              fillOpacity="0.1"
              d="M0,192L60,192C120,192,240,192,360,176C480,160,600,128,720,96C840,64,960,32,1080,58.7C1200,85,1320,171,1380,213.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320">
            <path
              fill="#273036"
              fillOpacity="0.1"
              d="M0,64L34.3,80C68.6,96,137,128,206,128C274.3,128,343,96,411,112C480,128,549,192,617,224C685.7,256,754,256,823,234.7C891.4,213,960,171,1029,170.7C1097.1,171,1166,213,1234,197.3C1302.9,181,1371,107,1406,69.3L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
          </svg>
        </div>
        <div className="absolute inset-y-1/4 left-0 w-full opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320">
            <path
              fill="#273036"
              d="M0,320L40,304C80,288,160,256,240,213.3C320,171,400,117,480,112C560,107,640,149,720,186.7C800,224,880,256,960,261.3C1040,267,1120,245,1200,250.7C1280,256,1360,288,1400,304L1440,320L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
          </svg>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8">
        <ProfileHeader />

        {/* Tabs Section */}
        <Tabs
          defaultValue="pets"
          className="space-y-6">
          <TabsList className="bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <TabsTrigger
              value="pets"
              className="gap-2">
              <Paw size={16} />
              Pets
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="gap-2">
              <History size={16} />
              History
            </TabsTrigger>
            <TabsTrigger
              value="owner"
              className="gap-2">
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
    </div>
  );
}

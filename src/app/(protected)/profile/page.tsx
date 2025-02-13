"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ProfileHeader } from "@/components/profile/owner/ProfileHeader";
import { PetCard } from "@/components/profile/pet/PetCard";
import { AddPetCard } from "@/components/profile/pet/AddPetCard";

// Add dummy data at the top
const dummyPet = {
  name: "Buddy",
  breed: "Golden Retriever",
  age: 3,
  image: "/placeholder-pet.jpg",
  status: ["Vaccinated", "Healthy"],
  weight: "25 kg",
  birthday: "Mar 15",
  gender: "Male",
};

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8">
      <ProfileHeader />

      {/* Tabs Section */}
      <Tabs
        defaultValue="pets"
        className="space-y-6">
        {/* Pets Tab */}
        <TabsContent value="pets">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PetCard pet={dummyPet} />
            <AddPetCard />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

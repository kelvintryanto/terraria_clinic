"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PetCard } from "@/components/profile/pet/PetCard";

// Dummy data
const pets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    image: "/placeholder-pet.jpg",
    status: ["Vaccinated", "Healthy"],
    weight: "25 kg",
    birthday: "Mar 15",
    gender: "Male",
  },
  {
    id: 2,
    name: "Luna",
    breed: "Persian Cat",
    age: 2,
    image: "/placeholder-pet.jpg",
    status: ["Vaccinated", "Check-up needed"],
    weight: "4 kg",
    birthday: "Jun 20",
    gender: "Female",
  },
];

export default function PetsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8">
      <h2 className="text-2xl font-bold text-white">My Pets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {pets.map((pet) => (
          <Link
            key={pet.id}
            href={`/profile/pets/${pet.id}`}>
            <PetCard pet={pet} />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

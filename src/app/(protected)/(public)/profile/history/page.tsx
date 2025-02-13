"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Dummy data
const bookingHistory = [
  {
    id: 1,
    petName: "Buddy",
    service: "Grooming",
    date: "February 15, 2024",
    status: "completed",
    price: "$50",
  },
  {
    id: 2,
    petName: "Max",
    service: "Vaccination",
    date: "February 10, 2024",
    status: "completed",
    price: "$75",
  },
  {
    id: 3,
    petName: "Luna",
    service: "Check-up",
    date: "March 1, 2024",
    status: "upcoming",
    price: "$45",
  },
];

export default function HistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8">
      <h2 className="text-2xl font-bold text-white">Booking History</h2>

      <div className="space-y-4">
        {bookingHistory.map((booking) => (
          <div
            key={booking.id}
            className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-violet-500/10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-white text-lg font-semibold">{booking.petName}</h3>
                <p className="text-orange-300/80">{booking.service}</p>
                <p className="text-white/70">{booking.date}</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                <p className="text-white text-lg font-semibold">{booking.price}</p>
                <Badge variant={booking.status === "completed" ? "default" : "secondary"}>{booking.status}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

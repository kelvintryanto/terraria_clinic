'use client';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Dummy data
const bookingHistory = [
  {
    id: 1,
    petName: 'Buddy',
    service: 'Grooming',
    date: '15 Februari 2024',
    status: 'selesai',
    price: 'Rp 500.000',
  },
  {
    id: 2,
    petName: 'Max',
    service: 'Vaksinasi',
    date: '10 Februari 2024',
    status: 'selesai',
    price: 'Rp 750.000',
  },
  {
    id: 3,
    petName: 'Luna',
    service: 'Pemeriksaan',
    date: '1 Maret 2024',
    status: 'mendatang',
    price: 'Rp 450.000',
  },
];

export default function HistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <h2 className="text-2xl font-bold text-white">Riwayat Kunjungan</h2>

      <div className="space-y-4">
        {bookingHistory.map((booking) => (
          <div
            key={booking.id}
            className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-violet-500/10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {booking.petName}
                </h3>
                <p className="text-orange-300/80">{booking.service}</p>
                <p className="text-white/70">{booking.date}</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                <p className="text-white text-lg font-semibold">
                  {booking.price}
                </p>
                <Badge
                  variant={
                    booking.status === 'selesai' ? 'default' : 'secondary'
                  }
                >
                  {booking.status === 'selesai' ? 'Selesai' : 'Mendatang'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

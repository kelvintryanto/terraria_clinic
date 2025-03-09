'use client';

import { formatCurrency } from '@/app/utils/format';
import { motion } from 'framer-motion';
import { CalendarClock, FilePlus2, Stethoscope, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Diagnose {
  _id: string;
  dxDate: string;
  createdAt: string;
  symptom: string;
  description: string;
  dogName: string;
}

interface ServiceItem {
  _id: string;
  name: string;
  price: number;
  date: string;
}

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  harga: number;
  total: number;
}

interface Invoice {
  _id: string;
  inpatientDate: string;
  createdAt: string;
  total: number;
  type: 'inpatient' | 'outpatient';
  services: ServiceItem[];
  cartItems: CartItem[];
  dogName: string;
}

interface HistoryItem {
  _id: string;
  date?: string;
  dxDate?: string;
  createdAt: string;
  amount?: number;
  total?: number;
  title: string;
  status: 'diagnose' | 'invoice';
  details: string;
  dogName: string;
}

interface DogHistoryProps {
  dogId: string;
}

export function DogHistory({ dogId }: DogHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profile/history/${dogId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }

        const data = await response.json();

        // Format diagnoses and invoices into a unified history array
        const formattedHistory: HistoryItem[] = [
          ...(data.diagnoses || []).map((diagnose: Diagnose) => ({
            _id: diagnose._id,
            date: diagnose.dxDate,
            createdAt: diagnose.createdAt,
            title: `Diagnosa: ${diagnose.symptom || 'Tidak ada gejala'}`,
            status: 'diagnose' as const,
            details: diagnose.description || 'Tidak ada deskripsi',
            dogName: diagnose.dogName,
          })),
          ...(data.invoices || []).map((invoice: Invoice) => ({
            _id: invoice._id,
            date: invoice.inpatientDate,
            createdAt: invoice.createdAt,
            amount: invoice.total,
            title: `Invoice: ${
              invoice.type === 'inpatient' ? 'Rawat Inap' : 'Rawat Jalan'
            }`,
            status: 'invoice' as const,
            details: `${invoice.services?.length || 0} layanan, ${
              invoice.cartItems?.length || 0
            } item`,
            dogName: invoice.dogName,
          })),
        ];

        // Sort by date, most recent first
        formattedHistory.sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt);
          const dateB = new Date(b.date || b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setHistory(formattedHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
        setError('Gagal memuat riwayat');
      } finally {
        setLoading(false);
      }
    };

    if (dogId) {
      fetchHistory();
    }
  }, [dogId]);

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          Riwayat Kunjungan
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-violet-900/30 rounded-lg p-4 border border-violet-500/10 h-20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Riwayat Kunjungan
        </h3>
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20 text-center">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">
        Riwayat Kunjungan
      </h3>

      {history.length === 0 ? (
        <div className="bg-violet-900/20 rounded-lg p-6 border border-violet-500/10 text-center">
          <FilePlus2 className="mx-auto h-8 w-8 text-violet-400 mb-2" />
          <p className="text-white/70">Belum ada riwayat kunjungan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-violet-900/30 rounded-lg p-4 border border-violet-500/10 hover:bg-violet-800/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center border border-orange-500/20 shrink-0">
                  {item.status === 'diagnose' ? (
                    <Stethoscope size={18} className="text-orange-300" />
                  ) : (
                    <Wallet size={18} className="text-orange-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <h4 className="text-white font-medium truncate">
                        {item.title}{' '}
                        {item.status === 'diagnose'
                          ? `untuk ${item.dogName}`
                          : `- ${item.dogName}`}
                      </h4>
                      <div className="flex items-center text-white/60 text-xs gap-1">
                        <CalendarClock size={12} />
                        <span>
                          {new Date(
                            item.date || item.createdAt
                          ).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {item.status === 'invoice' && item.amount && (
                      <div className="text-right">
                        <p className="text-orange-400 font-medium">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-white/70 text-sm mt-2">{item.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { formatDate } from '@/app/utils/format';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Diagnose {
  _id: string;
  dxNumber: string;
  dxDate: string;
  doctorName: string;
  symptom: string;
  description: string;
  dogSnapShot: {
    name: string;
    sex: string;
    color: string;
    weight: number;
  };
  createdAt: string;
}

interface Invoice {
  _id: string;
  invoiceNo: string;
  clientName: string;
  type: 'inpatient' | 'outpatient';
  status: string;
  total: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile/history');

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setDiagnoses(data.diagnoses || []);
        setInvoices(data.invoices || []);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat riwayat. Silakan coba lagi nanti.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <h2 className="text-2xl font-bold text-white">Riwayat Kunjungan</h2>

      <Tabs defaultValue="diagnose" className="w-full">
        <TabsList className="bg-violet-900/40 border border-white/10">
          <TabsTrigger
            value="diagnose"
            className="data-[state=active]:bg-violet-700 data-[state=active]:text-white"
          >
            Diagnosa
          </TabsTrigger>
          <TabsTrigger
            value="invoice"
            className="data-[state=active]:bg-violet-700 data-[state=active]:text-white"
          >
            Transaksi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnose" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="p-6 bg-violet-900/40 backdrop-blur-md animate-pulse h-24"
                />
              ))}
            </div>
          ) : diagnoses.length > 0 ? (
            <div className="space-y-4">
              {diagnoses.map((diagnose) => (
                <div
                  key={diagnose._id}
                  className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-violet-500/10"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-white text-lg font-semibold">
                        {diagnose.dogSnapShot?.name || 'Anjing'}
                      </h3>
                      <p className="text-orange-300/80">{diagnose.symptom}</p>
                      <p className="text-white/70">
                        {formatDate(diagnose.dxDate)}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                      <p className="text-white text-lg font-semibold">
                        {diagnose.dxNumber}
                      </p>
                      <Badge>Diagnosa</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-white/70">
              Belum ada riwayat diagnosa
            </div>
          )}
        </TabsContent>

        <TabsContent value="invoice" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="p-6 bg-violet-900/40 backdrop-blur-md animate-pulse h-24"
                />
              ))}
            </div>
          ) : invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-violet-500/10"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-white text-lg font-semibold">
                        {invoice.invoiceNo}
                      </h3>
                      <p className="text-orange-300/80">
                        {invoice.type === 'inpatient'
                          ? 'Rawat Inap'
                          : 'Rawat Jalan'}
                      </p>
                      <p className="text-white/70">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                      <p className="text-white text-lg font-semibold">
                        Rp {invoice.total?.toLocaleString('id-ID')}
                      </p>
                      <Badge
                        variant={
                          invoice.status === 'Selesai' ? 'default' : 'secondary'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-white/70">
              Belum ada riwayat transaksi
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

'use client';

import { formatDate } from '@/app/utils/format';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Dog,
  Receipt,
  Stethoscope,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Diagnose {
  _id: string;
  dxNumber: string;
  dxDate: string;
  doctorName: string;
  symptom: string;
  description: string;
  clientSnapShot?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  dogSnapShot: {
    name: string;
    sex: string;
    color: string;
    weight: number;
    birthYear?: string;
    birthMonth?: string;
    customBreed?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

interface ServiceItem {
  _id?: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  price: number;
}

interface CartItem {
  _id?: string;
  name: string;
  quantity: number;
  total: number;
  notes?: string;
}

interface Invoice {
  _id: string;
  invoiceNo: string;
  clientName: string;
  contact: string;
  type: 'inpatient' | 'outpatient';
  status: string;
  total: number;
  subtotal?: number;
  tax?: number;
  services?: ServiceItem[];
  cartItems?: CartItem[];
  inpatientDate?: string;
  inpatientTime?: string;
  dischargeDate?: string;
  dischargeTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function HistoryPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDiagnose, setExpandedDiagnose] = useState<string | null>(null);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
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

  const toggleDiagnoseExpand = (id: string) => {
    setExpandedDiagnose(expandedDiagnose === id ? null : id);
  };

  const toggleInvoiceExpand = (id: string) => {
    setExpandedInvoice(expandedInvoice === id ? null : id);
  };

  const calculateTax = (subtotal: number, tax: number): number => {
    return (subtotal * tax) / 100;
  };

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
                <Card
                  key={diagnose._id}
                  className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md border-violet-500/10 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div
                      className="p-4 sm:p-6 cursor-pointer"
                      onClick={() => toggleDiagnoseExpand(diagnose._id)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-violet-700/50 p-2 rounded-full">
                            <Stethoscope className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white text-lg font-semibold">
                                {diagnose.dogSnapShot?.name || 'Anjing'}
                              </h3>
                              <Badge
                                // variant=""
                                className="text-xs text-white"
                              >
                                {diagnose.dxNumber}
                              </Badge>
                            </div>
                            <p className="text-orange-300/80 line-clamp-1">
                              {diagnose.symptom}
                            </p>
                            <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(diagnose.dxDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Diagnosa</Badge>
                          {expandedDiagnose === diagnose._id ? (
                            <ChevronUp className="h-5 w-5 text-white/70" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-white/70" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedDiagnose === diagnose._id && (
                      <div className="px-4 sm:px-6 pb-6 pt-0 border-t border-violet-500/20 mt-2">
                        <div className="grid gap-4 mt-4">
                          <div>
                            <h4 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Dokter
                            </h4>
                            <p className="text-white text-sm">
                              {diagnose.doctorName}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                              <Dog className="h-4 w-4" />
                              Detail Anjing
                            </h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white">
                              <div>Warna: {diagnose.dogSnapShot.color}</div>
                              <div>Berat: {diagnose.dogSnapShot.weight} kg</div>
                              <div>
                                Jenis Kelamin:{' '}
                                {diagnose.dogSnapShot.sex === 'male'
                                  ? 'Jantan'
                                  : 'Betina'}
                              </div>
                              {diagnose.dogSnapShot.customBreed && (
                                <div>
                                  Ras: {diagnose.dogSnapShot.customBreed}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white/80 text-sm font-medium mb-2">
                              Keluhan
                            </h4>
                            <p className="text-white text-sm">
                              {diagnose.symptom}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-white/80 text-sm font-medium mb-2">
                              Hasil Pemeriksaan
                            </h4>
                            <p className="text-white text-sm whitespace-pre-line">
                              {diagnose.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                <Card
                  key={invoice._id}
                  className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md border-violet-500/10 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div
                      className="p-4 sm:p-6 cursor-pointer"
                      onClick={() => toggleInvoiceExpand(invoice._id)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-violet-700/50 p-2 rounded-full">
                            <Receipt className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white text-lg font-semibold">
                                {invoice.invoiceNo}
                              </h3>
                            </div>
                            <p className="text-orange-300/80">
                              {invoice.type === 'inpatient'
                                ? 'Rawat Inap'
                                : 'Rawat Jalan'}
                            </p>
                            <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(invoice.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-white text-lg font-semibold">
                            Rp {invoice.total?.toLocaleString('id-ID')}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                invoice.status === 'Selesai'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {invoice.status}
                            </Badge>
                            {expandedInvoice === invoice._id ? (
                              <ChevronUp className="h-5 w-5 text-white/70" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-white/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedInvoice === invoice._id && (
                      <div className="px-4 sm:px-6 pb-6 pt-0 border-t border-violet-500/20 mt-2">
                        <div className="grid gap-4 mt-4">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <span className="text-white/70">Nama Klien:</span>{' '}
                              <span className="text-white">
                                {invoice.clientName}
                              </span>
                            </div>
                            <div>
                              <span className="text-white/70">Kontak:</span>{' '}
                              <span className="text-white">
                                {invoice.contact}
                              </span>
                            </div>
                            {invoice.type === 'inpatient' && (
                              <>
                                <div>
                                  <span className="text-white/70">
                                    Tanggal Masuk:
                                  </span>{' '}
                                  <span className="text-white">
                                    {invoice.inpatientDate
                                      ? formatDate(invoice.inpatientDate)
                                      : '-'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-white/70">
                                    Jam Masuk:
                                  </span>{' '}
                                  <span className="text-white">
                                    {invoice.inpatientTime || '-'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-white/70">
                                    Tanggal Keluar:
                                  </span>{' '}
                                  <span className="text-white">
                                    {invoice.dischargeDate
                                      ? formatDate(invoice.dischargeDate)
                                      : '-'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-white/70">
                                    Jam Keluar:
                                  </span>{' '}
                                  <span className="text-white">
                                    {invoice.dischargeTime || '-'}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Services */}
                          {invoice.services && invoice.services.length > 0 && (
                            <div>
                              <h4 className="text-white/80 text-sm font-medium mb-2">
                                Layanan
                              </h4>
                              <div className="bg-black/20 rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-violet-500/20">
                                      <th className="text-left p-2 text-white/70">
                                        Nama
                                      </th>
                                      <th className="text-right p-2 text-white/70">
                                        Harga
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.services.map((service, index) => (
                                      <tr
                                        key={service._id || index}
                                        className="border-b border-violet-500/10 last:border-0"
                                      >
                                        <td className="p-2 text-white">
                                          {service.name}
                                        </td>
                                        <td className="p-2 text-white text-right">
                                          Rp{' '}
                                          {service.price.toLocaleString(
                                            'id-ID'
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Cart Items */}
                          {invoice.cartItems &&
                            invoice.cartItems.length > 0 && (
                              <div>
                                <h4 className="text-white/80 text-sm font-medium mb-2">
                                  Produk
                                </h4>
                                <div className="bg-black/20 rounded-md overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-violet-500/20">
                                        <th className="text-left p-2 text-white/70">
                                          Nama
                                        </th>
                                        <th className="text-center p-2 text-white/70">
                                          Jumlah
                                        </th>
                                        <th className="text-right p-2 text-white/70">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {invoice.cartItems.map((item, index) => (
                                        <tr
                                          key={item._id || index}
                                          className="border-b border-violet-500/10 last:border-0"
                                        >
                                          <td className="p-2 text-white">
                                            {item.name}
                                          </td>
                                          <td className="p-2 text-white text-center">
                                            {item.quantity}
                                          </td>
                                          <td className="p-2 text-white text-right">
                                            Rp{' '}
                                            {item.total.toLocaleString('id-ID')}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                          {/* Summary */}
                          <div className="mt-2 border-t border-violet-500/20 pt-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Subtotal:</span>
                              <span className="text-white">
                                Rp{' '}
                                {(invoice.subtotal || 0).toLocaleString(
                                  'id-ID'
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Pajak:</span>
                              <span className="text-white">
                                Rp{' '}
                                {calculateTax(
                                  invoice.subtotal || 0,
                                  invoice.tax || 0
                                ).toLocaleString('id-ID')}{' '}
                                <span className="text-white/60 text-xs">
                                  ({invoice.tax}%)
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold mt-1">
                              <span className="text-white/90">Total:</span>
                              <span className="text-white">
                                Rp {invoice.total.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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

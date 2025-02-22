'use client';

import { CartItemDetailCard } from '@/components/cards/CartItemDetailCard';
import { ServiceDetailCard } from '@/components/cards/ServiceDetailCard';
import { createPDFTemplate } from '@/components/pdfgenerator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceData } from '@/data/types';
import { toast } from '@/hooks/use-toast';
import { formatRupiah } from '@/lib/utils';
import { ArrowLeft, FileDown, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch invoice');
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data invoice',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete invoice');

      toast({
        title: 'Success',
        description: 'Invoice berhasil dihapus',
      });

      router.push('/cms/invoice');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus invoice',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async () => {
    try {
      if (!invoice) return;
      const pdf = await createPDFTemplate(invoice);
      pdf.save(`${invoice.invoiceNo}.pdf`);

      toast({
        title: 'Success',
        description: 'PDF berhasil diunduh',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengunduh PDF',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/cms/invoice')}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">Detail Invoice</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Download PDF
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1 sm:flex-initial text-xs sm:text-sm"
              >
                <Trash className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Invoice akan dihapus
                  secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg">
              Informasi Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">No. Invoice</p>
              <p className="font-medium">{invoice.invoiceNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nama Klien</p>
              <p className="font-medium">{invoice.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kontak</p>
              <p className="font-medium">{invoice.contact}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sub Akun</p>
              <p className="font-medium">{invoice.subAccount || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg">
              Informasi Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Booking</p>
              <p className="font-medium">
                {new Date(invoice.bookingDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Tanggal Rawat Inap
              </p>
              <p className="font-medium">
                {new Date(invoice.inpatientDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {invoice.dischargeDate && (
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pulang</p>
                <p className="font-medium">
                  {new Date(invoice.dischargeDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Lokasi</p>
              <p className="font-medium">{invoice.location}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Servis</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Desktop View - Table */}
            <div className="hidden md:block">
              <ScrollArea className="w-full">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Servis</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Durasi</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead>Staff</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.services.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {service.name}
                          </TableCell>
                          <TableCell>
                            {new Date(service.date).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'short',
                              }
                            )}
                          </TableCell>
                          <TableCell>{service.time}</TableCell>
                          <TableCell>{service.duration}</TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(service.price)}
                          </TableCell>
                          <TableCell>{service.staff}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>

            {/* Mobile View - Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {invoice.services.map((service, index) => (
                <ServiceDetailCard key={index} service={service} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              Keranjang Pasien
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Desktop View - Table */}
            <div className="hidden md:block">
              <ScrollArea className="w-full">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-center">Kuantitas</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.cartItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.kode}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {new Date(item.date).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(item.harga)}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>

            {/* Mobile View - Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {invoice.cartItems.map((item, index) => (
                <CartItemDetailCard key={index} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              Ringkasan Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">{formatRupiah(invoice.total)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Deposit</p>
                <p className="font-medium">{formatRupiah(invoice.deposit)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Sisa</p>
                <p className="font-medium">{formatRupiah(invoice.balance)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{invoice.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

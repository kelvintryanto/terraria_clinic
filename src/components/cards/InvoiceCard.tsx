import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceData } from '@/data/types';
import { formatRupiah } from '@/lib/utils';
import { Eye, FileDown } from 'lucide-react';

interface InvoiceCardProps {
  invoice: InvoiceData & { _id?: string };
  index: number;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function InvoiceCard({
  invoice,
  index,
  onView,
  onDownload,
}: InvoiceCardProps) {
  return (
    <Card className="hover:bg-accent cursor-pointer transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{invoice.invoiceNo}</h3>
            <span className="text-sm text-muted-foreground">#{index + 1}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Nama Klien</p>
              <p className="font-medium">{invoice.clientName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kontak</p>
              <p>{invoice.contact}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tanggal Booking</p>
              <p>
                {new Date(invoice.bookingDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">{formatRupiah(invoice.total)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Deposit</p>
                <p className="font-medium">{formatRupiah(invoice.deposit)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sisa</p>
                <p className="font-medium">{formatRupiah(invoice.balance)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(invoice._id || '');
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(invoice._id || '');
                }}
              >
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

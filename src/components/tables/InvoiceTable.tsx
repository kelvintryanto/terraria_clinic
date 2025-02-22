import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceData } from '@/data/types';
import { formatRupiah } from '@/lib/utils';
import { Eye, FileDown } from 'lucide-react';

interface InvoiceTableProps {
  invoices: (InvoiceData & { _id?: string })[];
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function InvoiceTable({
  invoices,
  onView,
  onDownload,
}: InvoiceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[50px]">No</TableHead>
          <TableHead className="w-[120px]">No. Invoice</TableHead>
          <TableHead className="w-[200px]">Nama Klien</TableHead>
          <TableHead className="hidden lg:table-cell">Kontak</TableHead>
          <TableHead className="hidden lg:table-cell">
            Tanggal Booking
          </TableHead>
          <TableHead className="text-center w-[120px]">Total</TableHead>
          <TableHead className="hidden lg:table-cell text-center">
            Deposit
          </TableHead>
          <TableHead className="hidden lg:table-cell text-center">
            Sisa
          </TableHead>
          <TableHead className="text-center w-[100px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={invoice._id}>
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell>{invoice.invoiceNo}</TableCell>
            <TableCell className="font-medium">{invoice.clientName}</TableCell>
            <TableCell className="hidden lg:table-cell">
              {invoice.contact}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {new Date(invoice.bookingDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </TableCell>
            <TableCell className="text-center">
              {formatRupiah(invoice.total)}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-center">
              {formatRupiah(invoice.deposit)}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-center">
              {formatRupiah(invoice.balance)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(invoice._id || '')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(invoice._id || '')}
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

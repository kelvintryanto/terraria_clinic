import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Service } from '@/data/types';
import { formatRupiah } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';

interface ServiceTableProps {
  services: Service[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  onRowClick,
}: ServiceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[50px]">No</TableHead>
          <TableHead className="w-[100px]">Kode</TableHead>
          <TableHead className="w-[250px]">Nama Layanan</TableHead>
          <TableHead className="w-[150px]">Kategori</TableHead>
          <TableHead className="hidden lg:table-cell">Deskripsi</TableHead>
          <TableHead className="text-center w-[120px]">Harga</TableHead>
          <TableHead className="text-center w-[100px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service, index) => (
          <TableRow
            key={service._id?.toString()}
            className="hover:cursor-pointer"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              onRowClick(service._id?.toString() || '');
            }}
          >
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell>{service.kode}</TableCell>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell>{service.category}</TableCell>
            <TableCell className="hidden lg:table-cell">
              <div className="max-w-xs truncate">
                {service.description
                  ? service.description
                  : 'Tidak ada deskripsi'}
              </div>
            </TableCell>
            <TableCell className="text-center">
              {formatRupiah(service.basePrice)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(service._id?.toString() || '');
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(service._id?.toString() || '');
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

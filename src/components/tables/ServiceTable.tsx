'use client';

import { canDeleteCategory, canEditCategory } from '@/app/utils/auth';
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
  userRole: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
}

export function ServiceTable({
  services,
  userRole,
  onEdit,
  onDelete,
  onRowClick,
}: ServiceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead className="text-right">Harga</TableHead>
          {(canEditCategory(userRole) || canDeleteCategory(userRole)) && (
            <TableHead className="text-center">Aksi</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service, index) => (
          <TableRow
            key={service._id?.toString()}
            className="cursor-pointer"
            onClick={() => onRowClick(service._id?.toString() || '')}
          >
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell>{service.name}</TableCell>
            <TableCell>
              <div className="max-w-xs truncate">{service.description}</div>
            </TableCell>
            <TableCell className="text-right">
              {formatRupiah(service.basePrice)}
            </TableCell>
            {(canEditCategory(userRole) || canDeleteCategory(userRole)) && (
              <TableCell>
                <div className="flex justify-center gap-2">
                  {canEditCategory(userRole) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(service._id?.toString() || '');
                      }}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {canDeleteCategory(userRole) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(service._id?.toString() || '');
                      }}
                      title="Hapus"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import { Product } from '@/app/models/products';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onRowClick,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">No</TableHead>
          <TableHead>Kode</TableHead>
          <TableHead>Nama Produk</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead className="text-center">Stok</TableHead>
          <TableHead className="text-center">Harga</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow
            key={product._id?.toString()}
            className="hover:cursor-pointer"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              onRowClick(product._id?.toString() || '');
            }}
          >
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell>{product.kode}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>
              <div className="max-w-xs truncate">{product.description}</div>
            </TableCell>
            <TableCell className="text-center">{product.jumlah}</TableCell>
            <TableCell className="text-center">
              {formatRupiah(product.harga)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product._id?.toString() || '');
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product._id?.toString() || '');
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

'use client';

import { Product } from '@/app/models/products';
import { canDeleteProduct, canEditProduct } from '@/app/utils/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  userRole: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (id: string) => void;
}

export function ProductTable({
  products,
  userRole,
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
          <TableHead>Nama</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead className="text-right">Harga</TableHead>
          <TableHead className="text-center">Stok</TableHead>
          {(canEditProduct(userRole) || canDeleteProduct(userRole)) && (
            <TableHead className="text-center">Aksi</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow
            key={product._id?.toString()}
            className="cursor-pointer"
            onClick={() => onRowClick?.(product._id?.toString() || '')}
          >
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell>{product.kode}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="text-right">
              {formatRupiah(product.harga)}
            </TableCell>
            <TableCell className="text-center">{product.jumlah}</TableCell>
            {(canEditProduct(userRole) || canDeleteProduct(userRole)) && (
              <TableCell>
                <div className="flex justify-center gap-2">
                  {canEditProduct(userRole) && onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product._id?.toString() || '');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Edit"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  )}
                  {canDeleteProduct(userRole) && onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product._id?.toString() || '');
                      }}
                      className="p-2 hover:bg-red-100 rounded-full"
                      title="Hapus"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
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

'use client';

import { Product } from '@/app/models/products';
import { canDeleteProduct, canEditProduct } from '@/app/utils/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  userRole: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function ProductCard({
  product,
  userRole,
  onEdit,
  onDelete,
  onClick,
}: ProductCardProps) {
  return (
    <Card
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(product._id?.toString() || '')}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.kode}</p>
            </div>
            {(canEditProduct(userRole) || canDeleteProduct(userRole)) && (
              <div className="flex gap-2">
                {canEditProduct(userRole) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product._id?.toString() || '');
                    }}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {canDeleteProduct(userRole) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(product._id?.toString() || '');
                    }}
                    title="Hapus"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Kategori</p>
              <p>{product.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stok</p>
              <p>{product.jumlah} unit</p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Harga</p>
            <p className="font-semibold">{formatRupiah(product.harga)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

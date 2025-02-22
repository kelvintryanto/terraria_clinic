import { Product } from '@/app/models/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { Box, Edit, Package, Tag, Trash } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function ProductCard({
  product,
  index,
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
            <h3 className="font-semibold truncate">{product.name}</h3>
            <span className="text-sm text-muted-foreground">#{index + 1}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Box className="h-4 w-4" />
              <span className="truncate">{product.kode}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>{product.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Stok: {product.jumlah}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span>{formatRupiah(product.harga)}</span>
            </div>
            {product.description && (
              <div className="text-muted-foreground truncate">
                {product.description}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
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
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product._id?.toString() || '');
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

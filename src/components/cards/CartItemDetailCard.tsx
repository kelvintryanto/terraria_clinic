import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/data/types';
import { formatRupiah } from '@/lib/utils';

interface CartItemDetailCardProps {
  item: CartItem;
}

export function CartItemDetailCard({ item }: CartItemDetailCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Kode</p>
          <p className="font-medium">{item.kode}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Nama</p>
          <p>{item.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tanggal</p>
          <p>
            {new Date(item.date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Harga</p>
            <p>{formatRupiah(item.harga)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kuantitas</p>
            <p>{item.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-medium">{formatRupiah(item.total)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

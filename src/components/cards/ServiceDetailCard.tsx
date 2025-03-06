import { Card, CardContent } from '@/components/ui/card';
import { ServiceItem } from '@/data/types';
import { formatRupiah } from '@/lib/utils';

interface ServiceDetailCardProps {
  service: ServiceItem;
}

export function ServiceDetailCard({ service }: ServiceDetailCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Servis</p>
              <p className="font-medium">{service.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Harga</p>
              <p className="font-medium">{formatRupiah(service.price)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p>
                {new Date(service.date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Waktu</p>
              <p>{service.time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Durasi</p>
              <p>{service.duration}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

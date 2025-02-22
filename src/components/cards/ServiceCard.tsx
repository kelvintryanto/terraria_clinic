import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/data/types';
import { formatRupiah } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function ServiceCard({
  service,
  index,
  onEdit,
  onDelete,
  onClick,
}: ServiceCardProps) {
  return (
    <Card
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(service._id?.toString() || '')}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{service.name}</h3>
            <span className="text-sm text-muted-foreground">#{index + 1}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <span>{formatRupiah(service.basePrice)}</span>
            </div>
            {service.description && (
              <div className="text-muted-foreground truncate">
                {service.description}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
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
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(service._id?.toString() || '');
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

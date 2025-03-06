'use client';

import { canDeleteCategory, canEditCategory } from '@/app/utils/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/data/types';
import { formatRupiah } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  userRole: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function ServiceCard({
  service,
  userRole,
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
            <div>
              <h3 className="font-semibold truncate">{service.name}</h3>
              <p className="text-sm text-muted-foreground">Layanan</p>
            </div>
            {(canEditCategory(userRole) || canDeleteCategory(userRole)) && (
              <div className="flex gap-2">
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
            )}
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Harga</p>
            <p className="font-semibold">{formatRupiah(service.basePrice)}</p>
          </div>
          {service.description && (
            <div>
              <p className="text-muted-foreground text-sm">Deskripsi</p>
              <p className="text-sm">{service.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

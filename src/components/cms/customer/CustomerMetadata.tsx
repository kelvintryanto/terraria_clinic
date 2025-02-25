import { Card, CardContent } from '@/components/ui/card';

interface CustomerMetadataProps {
  createdAt: string;
  updatedAt: string;
}

export function CustomerMetadata({
  createdAt,
  updatedAt,
}: CustomerMetadataProps) {
  return (
    <Card>
      <CardContent className="pt-3 sm:pt-4 md:pt-6 space-y-2 sm:space-y-3 md:space-y-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
            Dibuat pada
          </h3>
          <p className="text-xs sm:text-sm">
            {new Date(createdAt || '').toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
            Terakhir diperbarui
          </h3>
          <p className="text-xs sm:text-sm">
            {new Date(updatedAt || '').toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CustomerAddressProps {
  address: string;
}

export function CustomerAddress({ address }: CustomerAddressProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            Lokasi
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed sm:leading-relaxed break-words">
            {address}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

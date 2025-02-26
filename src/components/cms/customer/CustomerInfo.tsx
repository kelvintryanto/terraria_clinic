import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, User } from 'lucide-react';
import { Customer } from './types';

interface CustomerInfoProps {
  customer: Customer;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <Card>
      <CardContent className="pt-3 sm:pt-4 md:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-primary/10 rounded-lg self-start">
            <User className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <div className="space-y-2 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              {customer.name}
            </h1>
            <div className="flex flex-col gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm md:text-base">
              <div className="flex items-center gap-1 sm:gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="break-all">{customer.email}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

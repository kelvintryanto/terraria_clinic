'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Service } from '@/data/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ServiceSearchProps {
  onSelect: (service: Service) => void;
  initialValue?: {
    _id?: string;
    name: string;
  };
}

export function ServiceSearch({ onSelect, initialValue }: ServiceSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue?.name || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue?.name || '');
  }, [initialValue]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm h-9"
        >
          <span className="truncate flex-1 text-left">
            {value || 'Pilih servis...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-[350px] p-0 max-h-[280px] sm:max-h-[350px]"
        align="start"
      >
        <div className="flex flex-col gap-1 p-1.5">
          <Input
            placeholder="Cari servis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
          <ScrollArea className="h-[200px] sm:h-[280px]">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">
                  Servis tidak ditemukan.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 p-1">
                {filteredServices.map((service) => (
                  <Button
                    key={service._id?.toString()}
                    variant="ghost"
                    className="justify-start gap-1.5 h-fit py-2 px-2"
                    onClick={() => {
                      setValue(service.name);
                      onSelect(service);
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0',
                        value === service.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col items-start gap-1 min-w-0">
                      <span className="text-xs sm:text-sm truncate w-full">
                        {service.name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        Rp {service.basePrice?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Service } from '../../../../data/types';

interface ServiceSearchProps {
  onSelect: (service: Service) => void;
}

export function ServiceSearch({ onSelect }: ServiceSearchProps) {
  const [open, setOpen] = useState(false);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      const servicesArray = Array.isArray(data) ? data : [];

      setAllServices(servicesArray);
      setFilteredServices(servicesArray);
    } catch (error) {
      console.error('Error fetching services:', error);
      setAllServices([]);
      setFilteredServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredServices(allServices);
        return;
      }
      const filtered = allServices.filter((service) =>
        service.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredServices(filtered);
    }, 300),
    [allServices]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="w-full">
        <Input
          placeholder="Cari servis..."
          value={selectedService ? selectedService.name : searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setSelectedService(null);
            debouncedSearch(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full"
        />
      </div>

      {open && (
        <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <div className="relative">
            {isLoading ? (
              <div className="p-4 text-sm text-center">Memuat...</div>
            ) : filteredServices.length === 0 ? (
              <div className="p-4 text-sm text-center">
                Servis tidak ditemukan.
              </div>
            ) : (
              <div className="max-h-[200px] overflow-auto p-1">
                {filteredServices.map((service) => (
                  <div
                    key={service._id?.toString()}
                    className={cn(
                      'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                      selectedService?._id === service._id && 'bg-accent'
                    )}
                    onClick={() => {
                      setSelectedService(service);
                      setSearchTerm(service.name);
                      onSelect(service);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        selectedService?._id === service._id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{service.name}</span>
                      <div className="text-xs text-muted-foreground">
                        <span>
                          Harga: Rp {service.basePrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

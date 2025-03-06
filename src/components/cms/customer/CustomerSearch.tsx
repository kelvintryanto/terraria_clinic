'use client';

import { Customer } from '@/app/models/customer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void;
  initialValue?: string;
}

export default function CustomerSearchInput({
  onSelect,
  initialValue,
}: CustomerSearchProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialValue || '');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Update searchTerm when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      const customersArray = Array.isArray(data) ? data : [];

      setAllCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setAllCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredCustomers(allCustomers);
        return;
      }
      const filtered = allCustomers.filter((customer) =>
        customer.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }, 300),
    [allCustomers]
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
    <div className="relative w-full" ref={containerRef}>
      <div className="w-full">
        <Label htmlFor="search-customer">Cari Pelanggan</Label>
        <Input
          id="search-customer"
          placeholder="Cari Pelanggan..."
          value={selectedCustomer ? selectedCustomer.name : searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setSelectedCustomer(null);
            debouncedSearch(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 100); // Delay agar klik bisa terdeteksi sebelum dropdown tertutup
          }}
          className="w-full"
          autoComplete="off"
        />

        {open && (
          <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
            <div className="relative">
              {isLoading ? (
                <div className="p-4 text-sm text-center">Memuat...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-4 text-sm text-center">
                  Pelanggan tidak ditemukan.
                </div>
              ) : (
                <div className="max-h-[200px] overflow-auto p-1">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer._id?.toString()}
                      className={cn(
                        'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                        selectedCustomer?._id === customer._id && 'bg-accent'
                      )}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setSearchTerm(customer.name);
                        setFilteredCustomers(allCustomers);
                        onSelect(customer);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          selectedCustomer?._id === customer._id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{customer.name}</span>
                        <div className="text-xs text-muted-foreground">
                          <span>{customer.address}</span>
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
    </div>
  );
}

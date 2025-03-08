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
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialValue || '');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update searchTerm and try to find matching customer when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setSearchTerm(initialValue);

      // Try to find the customer with matching name
      const matchingCustomer = allCustomers.find(
        (customer) => customer.name === initialValue
      );
      if (matchingCustomer) {
        setSelectedCustomer(matchingCustomer);
      }
    } else {
      setSelectedCustomer(null);
    }
  }, [initialValue, allCustomers]);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();

      // Ensure each customer has the dogs property, defaulting to an empty array if not present
      const customersWithDogs = data.map((customer: Customer) => ({
        ...customer,
        dogs: customer.dogs || [],
      }));

      setAllCustomers(customersWithDogs);
      setFilteredCustomers(customersWithDogs);
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

  const handleCustomerSelect = (customer: Customer) => {
    console.log('Customer selected:', customer.name);
    setSearchTerm(customer.name);
    setSelectedCustomer(customer);
    setFilteredCustomers(allCustomers);
    onSelect(customer);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="w-full">
        <Label htmlFor="search-customer">Cari Pelanggan</Label>
        <Input
          id="search-customer"
          placeholder="Cari Pelanggan..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Don't immediately close the dropdown to allow for selection
            setTimeout(() => {
              if (selectedCustomer) {
                setSearchTerm(selectedCustomer.name);
              }
              setOpen(false);
            }, 200);
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
                      key={customer._id.toString()}
                      className={
                        'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ' +
                        (selectedCustomer &&
                        selectedCustomer._id.toString() ===
                          customer._id.toString()
                          ? 'bg-accent text-accent-foreground'
                          : '')
                      }
                      onClick={() => handleCustomerSelect(customer)}
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

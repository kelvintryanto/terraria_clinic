'use client';

import { Customer } from '@/app/models/customer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Custom debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CustomerPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { toast } = useToast();

  const calculateJoinDuration = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - join.getFullYear()) * 12 +
      (now.getMonth() - join.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    if (years > 0) {
      return `${years} tahun ${months} bulan`;
    }
    return `${months} bulan`;
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Gagal mengambil data pelanggan',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [toast]);

  // Filter customers when search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchLower) ||
        customer.address.toLowerCase().includes(searchLower)
    );
    setFilteredCustomers(filtered);
  }, [debouncedSearch, customers]);

  useEffect(() => {
    // Check for success message in URL
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    if (success === 'created') {
      toast({
        title: 'Berhasil!',
        description: 'Pelanggan berhasil ditambahkan.',
        duration: 2000,
      });
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  const handleCustomerClick = (customerId: string) => {
    router.push(`/cms/customer/${customerId}`);
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="w-full p-3 sm:p-5">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Halaman Pelanggan
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/cms/customer/add">Tambah Pelanggan</Link>
          </Button>
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Nama Pelanggan</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nomor Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="text-center">Lama Bergabung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow
                key={customer._id.toString()}
                className="hover:cursor-pointer"
                onClick={() => handleCustomerClick(customer._id.toString())}
              >
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell className="text-center">
                  {calculateJoinDuration(customer.joinDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredCustomers.map((customer, index) => (
          <Card
            key={customer._id.toString()}
            className="hover:bg-accent cursor-pointer transition-colors"
            onClick={() => handleCustomerClick(customer._id.toString())}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{customer.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{calculateJoinDuration(customer.joinDate)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerPage;

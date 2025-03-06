'use client';

import {
  canCreateCustomer,
  canDeleteCustomer,
  canEditCustomer,
} from '@/app/utils/auth';
import { CustomerTable } from '@/components/cms/customer/CustomerTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton-table';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CustomerPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        if (data.user) {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch customers',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = customers.filter(
      (customer: Customer) =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  if (loading) return <TableSkeleton />;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Pelanggan</h1>
        {canCreateCustomer(userRole) && (
          <Link href="/cms/customer/add">
            <Button>Tambah Pelanggan</Button>
          </Link>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Cari pelanggan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <CustomerTable
        customers={filteredCustomers}
        canEdit={canEditCustomer(userRole)}
        canDelete={canDeleteCustomer(userRole)}
        onCustomerUpdated={() => {
          // Refresh the customer list
          window.location.reload();
        }}
      />
    </div>
  );
}

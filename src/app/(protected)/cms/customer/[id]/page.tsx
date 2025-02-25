'use client';

import { Breed } from '@/app/models/breed';
import { AddDogDialog } from '@/components/cms/customer/AddDogDialog';
import { CustomerAddress } from '@/components/cms/customer/CustomerAddress';
import { CustomerDetailSkeleton } from '@/components/cms/customer/CustomerDetailSkeleton';
import { CustomerHeader } from '@/components/cms/customer/CustomerHeader';
import { CustomerInfo } from '@/components/cms/customer/CustomerInfo';
import { CustomerMetadata } from '@/components/cms/customer/CustomerMetadata';
import { DeleteCustomerDialog } from '@/components/cms/customer/DeleteCustomerDialog';
import { DeleteDogDialog } from '@/components/cms/customer/DeleteDogDialog';
import { DogList } from '@/components/cms/customer/DogList';
import { EditCustomerDialog } from '@/components/cms/customer/EditCustomerDialog';
import {
  Customer,
  DogForm,
  EditForm,
  initialDogForm,
} from '@/components/cms/customer/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
});

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer>({
    _id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    createdAt: '',
    updatedAt: '',
    dogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDogDialogOpen, setIsAddDogDialogOpen] = useState(false);
  const [dogToDelete, setDogToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDogDeleteDialogOpen, setIsDogDeleteDialogOpen] = useState(false);
  const [dogForm, setDogForm] = useState<DogForm>(initialDogForm);
  const { toast } = useToast();
  const [editForm, setEditForm] = useState<EditForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [breeds, setBreeds] = useState<Breed[]>([]);

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
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/customers/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch customer: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();

        setCustomer(data);
        setEditForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (error) {
        console.error('Error fetching customer:', error);
        setError('Failed to load customer data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds');
        if (!response.ok) throw new Error('Failed to fetch breeds');

        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data ras anjing',
          variant: 'destructive',
        });
      }
    };
    fetchBreeds();
  }, [toast]);

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);

      // Validate form data
      const validatedData = formSchema.parse(editForm);

      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setIsEditDialogOpen(false);
      toast({
        title: 'Berhasil',
        description: 'Data pelanggan berhasil diperbarui',
      });

      router.refresh();
    } catch (error) {
      console.error('Error updating customer:', error);
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validasi Gagal',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Gagal',
          description: 'Gagal memperbarui data pelanggan',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      toast({
        title: 'Berhasil',
        description: 'Pelanggan berhasil dihapus',
      });
      router.push('/cms/customer');
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal menghapus pelanggan',
        variant: 'destructive',
      });
    }
  };

  const handleAddDog = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/customers/${id}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to add dog');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setDogForm(initialDogForm);
      setIsAddDogDialogOpen(false);
      toast({
        title: 'Berhasil',
        description: 'Anjing berhasil ditambahkan',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan anjing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDog = async () => {
    if (!dogToDelete) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/customers/${id}/dogs/${dogToDelete.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete dog');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setIsDogDeleteDialogOpen(false);
      setDogToDelete(null);
      toast({
        title: 'Berhasil',
        description: 'Anjing berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting dog:', error);
      toast({
        title: 'Gagal',
        description: 'Gagal menghapus anjing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CustomerDetailSkeleton />;
  if (error || !customer) {
    return (
      <div className="w-full p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">
                {error || 'Pelanggan tidak ditemukan'}
              </p>
              <Button onClick={() => router.push('/cms/customer')}>
                Kembali ke Daftar Pelanggan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <DeleteCustomerDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        userRole={userRole}
      />

      <DeleteDogDialog
        open={isDogDeleteDialogOpen}
        onOpenChange={setIsDogDeleteDialogOpen}
        dogName={dogToDelete?.name || null}
        onDelete={handleDeleteDog}
        onCancel={() => setDogToDelete(null)}
        isSubmitting={isSubmitting}
      />

      <div className="w-full min-h-full p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-8">
        {/* Header with back button */}
        <CustomerHeader
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
          userRole={userRole}
        />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-8">
            <CustomerInfo customer={customer} />
            <CustomerAddress address={customer.address} />
            <DogList
              dogs={customer.dogs}
              breeds={breeds}
              userRole={userRole}
              onAddDog={() => setIsAddDogDialogOpen(true)}
              onDeleteDog={(dog) => {
                setDogToDelete(dog);
                setIsDogDeleteDialogOpen(true);
              }}
            />
          </div>

          {/* Right column - Metadata */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <CustomerMetadata
              createdAt={customer.createdAt}
              updatedAt={customer.updatedAt}
            />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditCustomerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleEdit}
        isSubmitting={isSubmitting}
      />

      {/* Add Dog Dialog */}
      <AddDogDialog
        open={isAddDogDialogOpen}
        onOpenChange={setIsAddDogDialogOpen}
        dogForm={dogForm}
        setDogForm={setDogForm}
        onAddDog={handleAddDog}
        isSubmitting={isSubmitting}
        breeds={breeds}
      />
    </>
  );
}

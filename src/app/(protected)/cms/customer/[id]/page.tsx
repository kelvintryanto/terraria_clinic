'use client';

import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { canDeleteCustomer, canEditCustomer } from '@/app/utils/auth';
import { AddDogDialog } from '@/components/cms/customer/AddDogDialog';
import { CustomerAddress } from '@/components/cms/customer/CustomerAddress';
import { CustomerDetailSkeleton } from '@/components/cms/customer/CustomerDetailSkeleton';
import { CustomerHeader } from '@/components/cms/customer/CustomerHeader';
import { CustomerInfo } from '@/components/cms/customer/CustomerInfo';
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
import { use, useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

type EditDogForm = Omit<Partial<Dog>, 'breedId'> & {
  breedId?: string;
};

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

  // Define fetchCustomer using useCallback
  const fetchCustomer = useCallback(async () => {
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

      // Access the customer property from the response
      const customerData = data.customer;
      setCustomer(customerData);
      setEditForm({
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
      });
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer data');
      toast({
        title: 'Error',
        description: 'Failed to load customer data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

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
    if (id) {
      fetchCustomer();
    }
  }, [id, fetchCustomer]);

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

      // Refetch the customer data to ensure we have the complete and latest data
      await fetchCustomer();
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

      // No need to refetch here since we're navigating away
      router.push('/cms/customer');
      toast({
        title: 'Berhasil',
        description: 'Pelanggan berhasil dihapus',
      });
    } catch (error) {
      console.log(error);
      console.error('Error deleting customer:', error);
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

      // Refetch customer data to get the updated dogs list
      await fetchCustomer();

      setDogForm(initialDogForm);
      setIsAddDogDialogOpen(false);
      toast({
        title: 'Berhasil',
        description: 'Anjing berhasil ditambahkan',
      });
    } catch (error) {
      console.error('Error adding dog:', error);
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
        throw new Error('Failed to delete dog');
      }

      // Refetch customer data to get the updated dogs list
      await fetchCustomer();

      setIsDogDeleteDialogOpen(false);
      setDogToDelete(null);
      toast({
        title: 'Berhasil',
        description: 'Anjing berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting dog:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus anjing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDog = async (dogId: string, updatedDog: EditDogForm) => {
    try {
      const response = await fetch(`/api/customers/${id}/dogs/${dogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDog),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update dog');
      }

      // Refetch customer data to get the updated dogs list
      await fetchCustomer();

      toast({
        title: 'Berhasil',
        description: 'Data anjing berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error updating dog:', error);
      toast({
        title: 'Gagal',
        description: 'Gagal memperbarui data anjing',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (isLoading) return <CustomerDetailSkeleton />;
  if (error || !customer) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center space-y-3 sm:space-y-4">
              <p className="text-destructive text-sm sm:text-base">
                {error || 'Pelanggan tidak ditemukan'}
              </p>
              <Button
                onClick={() => router.push('/cms/customer')}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
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

      <div className="w-full min-h-full space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header with back button */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <CustomerHeader
              onEdit={
                canEditCustomer(userRole)
                  ? () => setIsEditDialogOpen(true)
                  : undefined
              }
              onDelete={
                canDeleteCustomer(userRole)
                  ? () => setIsDeleteDialogOpen(true)
                  : undefined
              }
            />
          </div>
        </div>

        {/* Main content */}
        <div className="container max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Customer info and address - left side */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              <CustomerInfo customer={customer} />
              <CustomerAddress address={customer?.address || ''} />
            </div>

            {/* Dogs list - right side */}
            <div className="lg:col-span-8">
              <DogList
                dogs={customer?.dogs || []}
                breeds={breeds || []}
                userRole={userRole || ''}
                onAddDog={() => setIsAddDogDialogOpen(true)}
                onDeleteDog={(dog) => {
                  setDogToDelete(dog);
                  setIsDogDeleteDialogOpen(true);
                }}
                onEditDog={handleEditDog}
              />
            </div>
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

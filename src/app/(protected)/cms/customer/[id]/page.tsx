'use client';

import { Dog } from '@/app/models/dog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Dog as DogIcon,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { z } from 'zod';

// Interface for component state (simplified from the MongoDB model)
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  dogs: Dog[];
}

type DogForm = Omit<Dog, '_id'>;

const initialDogForm: DogForm = {
  name: '',
  breed: '',
  age: 0,
  color: '',
};

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
});

function CustomerDetailSkeleton() {
  return (
    <div className="w-full h-full animate-pulse space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

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
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

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

  const handleDeleteDog = async (dogId: string) => {
    if (!dogToDelete) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/customers/${id}/dogs/${dogId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete dog');

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setIsDogDeleteDialogOpen(false);
      setDogToDelete(null);
      toast({
        title: 'Berhasil',
        description: 'Anjing berhasil dihapus',
      });
    } catch {
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pelanggan akan dihapus
              secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            {userRole !== 'admin' && (
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDogDeleteDialogOpen}
        onOpenChange={setIsDogDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data anjing{' '}
              {dogToDelete?.name} akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel onClick={() => setDogToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => dogToDelete && handleDeleteDog(dogToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full min-h-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            variant="ghost"
            className="gap-2 w-full sm:w-auto justify-start"
            onClick={() => router.push('/cms/customer')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sm:inline">Kembali ke Daftar Pelanggan</span>
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-initial"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {userRole !== 'admin' && (
              <Button
                variant="destructive"
                className="gap-2 flex-1 sm:flex-initial"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus</span>
              </Button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg self-start">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold">
                      {customer.name}
                    </h1>
                    <div className="flex flex-col gap-2 text-muted-foreground text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="break-all">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <h2 className="text-base sm:text-lg font-semibold">Lokasi</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-600 text-sm sm:text-base">
                    {customer.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <DogIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Daftar Anjing
                </CardTitle>
                <Button
                  onClick={() => setIsAddDogDialogOpen(true)}
                  className="gap-2 text-sm"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Anjing
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {customer.dogs.map((dog) => (
                    <Card key={dog._id.toString()} className="mb-4">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <DogIcon className="h-4 w-4" />
                            {dog.name}
                          </div>
                        </CardTitle>
                        {userRole === 'super_admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                            onClick={() => {
                              setDogToDelete({
                                id: dog._id.toString(),
                                name: dog.name,
                              });
                              setIsDogDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <div>Breed: {dog.breed}</div>
                          <div>Age: {dog.age} years</div>
                          <div>Color: {dog.color}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {customer.dogs.length === 0 && (
                    <p className="text-muted-foreground col-span-2 text-center py-4 text-sm sm:text-base">
                      Belum ada anjing terdaftar
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Metadata */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Dibuat pada
                  </h3>
                  <p className="text-xs sm:text-sm">
                    {new Date(customer.createdAt || '').toLocaleDateString(
                      'id-ID',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Terakhir diperbarui
                  </h3>
                  <p className="text-xs sm:text-sm">
                    {new Date(customer.updatedAt || '').toLocaleDateString(
                      'id-ID',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>
              Ubah informasi pelanggan di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dog Dialog */}
      <Dialog open={isAddDogDialogOpen} onOpenChange={setIsAddDogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Anjing Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail anjing di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dog-name">Nama</Label>
              <Input
                id="dog-name"
                value={dogForm.name}
                onChange={(e) =>
                  setDogForm({ ...dogForm, name: e.target.value })
                }
                placeholder="Nama anjing"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dog-breed">Ras</Label>
              <Input
                id="dog-breed"
                value={dogForm.breed}
                onChange={(e) =>
                  setDogForm({ ...dogForm, breed: e.target.value })
                }
                placeholder="Ras anjing"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dog-age">Umur (tahun)</Label>
              <Input
                id="dog-age"
                type="number"
                value={dogForm.age}
                onChange={(e) =>
                  setDogForm({ ...dogForm, age: parseInt(e.target.value) })
                }
                placeholder="Umur anjing"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dog-color">Warna</Label>
              <Input
                id="dog-color"
                value={dogForm.color}
                onChange={(e) =>
                  setDogForm({ ...dogForm, color: e.target.value })
                }
                placeholder="Warna anjing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDogDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button onClick={handleAddDog} disabled={isSubmitting}>
              {isSubmitting ? 'Menambahkan...' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

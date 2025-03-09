'use client';

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
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Mail, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const editFormSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
});

type EditFormData = z.infer<typeof editFormSchema>;

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

export default function AdminPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [adminToDelete, setAdminToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [adminToEdit, setAdminToEdit] = useState<Admin | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        if (data.user) {
          setUserRole(data.user.role);
          // If not super_admin, redirect to dashboard
          if (data.user.role !== 'super_admin') {
            window.location.href = '/cms';
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (adminToEdit) {
      editForm.reset({
        name: adminToEdit.name,
        email: adminToEdit.email,
      });
    }
  }, [adminToEdit, editForm]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/cms/users', {
          credentials: 'include',
        });
        const data = await response.json();
        // Filter admin users (include both admin and admin2, exclude super_admin)
        const adminUsers = data.filter(
          (user: Admin) => user.role === 'admin' || user.role === 'admin2'
        );
        setAdmins(adminUsers);
        setFilteredAdmins(adminUsers);
      } catch {
        toast({
          title: 'Error',
          description: 'Gagal mengambil data admin',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [toast]);

  // Filter admins when search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredAdmins(admins);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower)
    );
    setFilteredAdmins(filtered);
  }, [debouncedSearch, admins]);

  const handleDelete = async (adminId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const admin = admins.find((a) => a._id === adminId);
    if (admin) {
      setAdminToDelete({ id: adminId, name: admin.name });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleEdit = (admin: Admin, e: React.MouseEvent) => {
    e.stopPropagation();
    setAdminToEdit(admin);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      const response = await fetch(`/api/cms/users/${adminToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus admin');
      }

      toast({
        title: 'Berhasil',
        description: 'Admin berhasil dihapus',
      });

      // Remove the deleted admin from the state
      setAdmins(admins.filter((a) => a._id !== adminToDelete.id));
      setFilteredAdmins(
        filteredAdmins.filter((a) => a._id !== adminToDelete.id)
      );
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Gagal menghapus admin',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const onEditSubmit = async (data: EditFormData) => {
    if (!adminToEdit) return;

    try {
      const response = await fetch(`/api/cms/users/${adminToEdit._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal mengubah data admin');
      }

      toast({
        title: 'Berhasil',
        description: 'Data admin berhasil diubah',
      });

      // Update the admin in the state
      const updatedAdmins = admins.map((admin) =>
        admin._id === adminToEdit._id ? { ...admin, ...data } : admin
      );
      setAdmins(updatedAdmins);
      setFilteredAdmins(
        filteredAdmins.map((admin) =>
          admin._id === adminToEdit._id ? { ...admin, ...data } : admin
        )
      );

      setIsEditDialogOpen(false);
      setAdminToEdit(null);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Gagal mengubah data admin',
        variant: 'destructive',
      });
    }
  };

  // Only render if user is super_admin
  if (userRole && userRole !== 'super_admin') {
    return null;
  }

  if (loading) return <TableSkeleton />;

  return (
    <div className="container mx-auto">
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data admin{' '}
              {adminToDelete?.name} akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel onClick={() => setAdminToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Ubah data admin. Semua field wajib diisi.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-6"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Masukkan email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setAdminToEdit(null);
                  }}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Manajemen Admin</h1>
        <Link href="/cms/admin/add">
          <Button>Tambah Admin</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Cari admin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin, index) => (
              <TableRow key={admin._id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {admin.role === 'admin2' ? 'Admin 2' : 'Admin'}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(admin, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(admin._id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredAdmins.map((admin) => (
          <Card
            key={admin._id}
            className="hover:bg-accent cursor-pointer transition-colors"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold truncate">{admin.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {admin.role === 'admin2' ? 'Admin 2' : 'Admin'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(admin, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(admin._id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 opacity-70" />
                  <span className="text-sm">{admin.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

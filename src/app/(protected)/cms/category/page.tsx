'use client';

import { Category } from '@/app/models/category';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/skeleton-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Edit, Layers2, Package, Trash, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'product' | 'service'>('product');
  const [filteredCategory, setFilteredCategory] = useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryIdToUpdate, setCategoryIdToUpdate] = useState<string | null>(
    null
  );
  const [categoryToUpdate, setCategoryToUpdate] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      setFilteredCategory(
        data.filter((cat: Category) => cat.type === activeTab)
      );
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal mengambil data kategori',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredCategory(categories.filter((cat) => cat.type === activeTab));
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = categories.filter(
      (cat) =>
        cat.type === activeTab && cat.name.toLowerCase().includes(searchLower)
    );
    setFilteredCategory(filtered);
  }, [debouncedSearch, categories, activeTab]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete product');

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      fetchCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('kategori') as string;
    const type = formData.get('type') as 'product' | 'service';

    try {
      const response = await fetch(`/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      toast({
        title: 'Berhasil',
        description: 'Kategori berhasil ditambahkan',
      });

      fetchCategories();
      setCreateDialogOpen(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan kategori',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('kategori') as string;
    const type = formData.get('type') as 'product' | 'service';

    try {
      const response = await fetch(`/api/categories/${categoryIdToUpdate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type }),
      });

      if (!response.ok) throw new Error('Failed to update category');

      toast({
        title: 'Berhasil',
        description: 'Kategori berhasil diubah',
      });

      fetchCategories();
      setCreateDialogOpen(false);
      setCategoryIdToUpdate(null);
      setCategoryToUpdate(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal mengubah kategori',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryToEdit = categoryIdToUpdate
    ? categories.find((cat) => cat._id.toString() === categoryIdToUpdate)
    : null;

  if (loading) return <TableSkeleton />;

  return (
    <>
      {/* delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* create and update dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {categoryIdToUpdate ? 'Edit Kategori' : 'Tambah Kategori'}
            </DialogTitle>
            <DialogDescription>
              {categoryIdToUpdate
                ? 'Edit kategori yang sudah ada'
                : 'Tambah kategori baru untuk produk atau layanan'}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={categoryIdToUpdate ? handleUpdate : handleSubmit}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe</Label>
              <Select
                name="type"
                defaultValue={categoryToEdit?.type || activeTab}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Produk</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="service">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      <span>Layanan</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Nama Kategori</Label>
              <Input
                id="kategori"
                name="kategori"
                defaultValue={categoryToUpdate || ''}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {categoryIdToUpdate ? 'Simpan' : 'Tambah'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="w-full p-3 sm:p-5">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            Halaman Kategori
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari kategori..."
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
            <Button
              onClick={() => {
                setCategoryIdToUpdate(null);
                setCategoryToUpdate(null);
                setCreateDialogOpen(true);
              }}
              className="flex-1 sm:flex-none"
            >
              <Layers2 className="w-4 h-4 mr-2" />
              Tambah Kategori
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="product"
          className="w-full"
          onValueChange={(value) =>
            setActiveTab(value as 'product' | 'service')
          }
        >
          <TabsList className="mb-4 bg-background border">
            <TabsTrigger
              value="product"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Produk
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Wrench className="h-4 w-4" />
              Layanan
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-[50px]">No</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead className="text-center w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategory.map((category, index) => (
                  <TableRow key={category._id.toString()}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCategoryIdToUpdate(category._id.toString());
                            setCategoryToUpdate(category.name);
                            setCreateDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setCategoryToDelete(category._id.toString());
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </div>
    </>
  );
}

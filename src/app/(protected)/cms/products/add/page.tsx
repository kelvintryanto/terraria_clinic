'use client';

import { Category } from '@/app/models/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        // Filter only product categories
        setCategories(data.filter((cat: Category) => cat.type === 'product'));
      } catch (error) {
        console.error('Error on fetching categories', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data kategori',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      kode: formData.get('kode'),
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      jumlah: parseInt(formData.get('jumlah') as string),
      harga: parseInt(formData.get('harga') as string),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to create product');

      toast({
        title: 'Berhasil',
        description: 'Produk berhasil ditambahkan',
      });

      router.push('/cms/products');
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan produk',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kode</label>
            <Input type="text" name="kode" required className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Produk
            </label>
            <Input type="text" name="name" required className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <Select name="category" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori produk" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id.toString()}
                    value={category.name}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <Textarea
              required
              name="description"
              className="w-full"
              placeholder="Isi dengan (-) jika tidak ada deskripsi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stok</label>
            <Input type="number" name="jumlah" required className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga</label>
            <Input type="number" name="harga" required className="w-full" />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/cms/products')}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

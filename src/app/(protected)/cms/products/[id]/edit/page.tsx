'use client';

import { Product } from '@/app/models/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

function EditFormSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Gagal mengambil data produk',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast({
        title: 'Berhasil',
        description: 'Produk berhasil diperbarui',
      });

      router.push('/cms/products');
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui produk',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <EditFormSkeleton />;
  if (!product) return <div>Produk tidak ditemukan</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kode</label>
            <Input
              type="text"
              name="kode"
              defaultValue={product.kode}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Produk
            </label>
            <Input
              type="text"
              name="name"
              defaultValue={product.name}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <Input
              type="text"
              name="category"
              defaultValue={product.category}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <Textarea
              name="description"
              defaultValue={product.description}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stok</label>
            <Input
              type="number"
              name="jumlah"
              defaultValue={product.jumlah}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga</label>
            <Input
              type="number"
              name="harga"
              defaultValue={product.harga}
              required
              className="w-full"
            />
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
              {loading ? 'Memperbarui...' : 'Perbarui Produk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

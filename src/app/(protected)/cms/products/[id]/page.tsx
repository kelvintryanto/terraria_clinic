'use client';

import { Product } from '@/app/models/products';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Package, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

// Rupiah formatter function
const formatRupiah = (price: number) => {
  const priceString = price.toString();
  let result = '';
  let counter = 0;

  for (let i = priceString.length - 1; i >= 0; i--) {
    counter++;
    result = priceString[i] + result;
    if (counter % 3 === 0 && i !== 0) {
      result = '.' + result;
    }
  }

  return `Rp ${result}`;
};

function ProductDetailSkeleton() {
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/products/${id}`
        );
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
  }, [id, toast]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast({
        title: 'Berhasil',
        description: 'Produk berhasil dihapus',
      });

      router.push('/cms/products');
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal menghapus produk',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <div>Produk tidak ditemukan</div>;

  return (
    <>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full min-h-full p-6 space-y-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push('/cms/products')}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Produk
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push(`/cms/products/${id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      Kode: {product.kode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Deskripsi Produk</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description || 'Tidak ada deskripsi'}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Kategori
                  </h3>
                  <p className="text-lg font-semibold">{product.category}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Stok Tersedia
                  </h3>
                  <p className="text-lg font-semibold">{product.jumlah} unit</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - Price and metadata */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Harga
                </h3>
                <p className="text-3xl font-bold text-primary">
                  {formatRupiah(product.harga)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Dibuat pada
                  </h3>
                  <p className="text-sm">
                    {new Date(product.createdAt || '').toLocaleDateString(
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
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Terakhir diperbarui
                  </h3>
                  <p className="text-sm">
                    {new Date(product.updatedAt || '').toLocaleDateString(
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
    </>
  );
}

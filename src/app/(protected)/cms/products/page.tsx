'use client';

import { Product } from '@/app/models/products';
import { ProductCard } from '@/components/cards/ProductCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { ProductTable } from '@/components/tables/ProductTable';
import { ServiceTable } from '@/components/tables/ServiceTable';
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
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Service } from '@/data/types';
import { toast } from '@/hooks/use-toast';
import { Package, Wrench } from 'lucide-react';
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>(
    'products'
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'product' | 'service';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'product' | 'service') => {
    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      toast({
        title: 'Success',
        description: `${
          type === 'product' ? 'Product' : 'Service'
        } deleted successfully`,
      });

      if (type === 'product') {
        fetchProducts();
      } else {
        fetchServices();
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast({
        title: 'Error',
        description: `Failed to delete ${type}`,
        variant: 'destructive',
      });
    }
  };

  const handleRowClick = (id: string, type: 'product' | 'service') => {
    router.push(`/cms/${type}s/${id}`);
  };

  useEffect(() => {
    fetchProducts();
    fetchServices();
  }, []);

  // Filter items when search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredProducts(products);
      setFilteredServices(services);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();

    const filteredProds = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.kode.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.description &&
          product.description.toLowerCase().includes(searchLower))
    );
    setFilteredProducts(filteredProds);

    const filteredServs = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchLower) ||
        (service.description &&
          service.description.toLowerCase().includes(searchLower))
    );
    setFilteredServices(filteredServs);
  }, [debouncedSearch, products, services]);

  if (loading) return <TableSkeleton />;

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.{' '}
              {itemToDelete?.type === 'product' ? 'Produk' : 'Layanan'} akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                itemToDelete && handleDelete(itemToDelete.id, itemToDelete.type)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full p-3 sm:p-5">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            Halaman Produk & Layanan
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari..."
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
            <div className="flex gap-2 w-full sm:w-auto">
              {activeTab === 'products' ? (
                <Button asChild className="flex-1 sm:flex-none">
                  <Link href="/cms/products/add">Tambah Produk</Link>
                </Button>
              ) : (
                <Button asChild className="flex-1 sm:flex-none">
                  <Link href="/cms/services/add">Tambah Layanan</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="products"
          className="w-full"
          onValueChange={(value) =>
            setActiveTab(value as 'products' | 'services')
          }
        >
          <TabsList className="mb-4 bg-background border">
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Produk
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Wrench className="h-4 w-4" />
              Layanan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {/* Desktop View - Products Table */}
            <div className="hidden md:block">
              <ProductTable
                products={filteredProducts}
                onEdit={(id) => router.push(`/cms/products/${id}/edit`)}
                onDelete={(id) => {
                  setItemToDelete({ id, type: 'product' });
                  setDeleteDialogOpen(true);
                }}
                onRowClick={(id) => handleRowClick(id, 'product')}
              />
            </div>

            {/* Mobile View - Products Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id?.toString()}
                  product={product}
                  index={index}
                  onEdit={(id) => router.push(`/cms/products/${id}/edit`)}
                  onDelete={(id) => {
                    setItemToDelete({ id, type: 'product' });
                    setDeleteDialogOpen(true);
                  }}
                  onClick={(id) => handleRowClick(id, 'product')}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            {/* Desktop View - Services Table */}
            <div className="hidden md:block">
              <ServiceTable
                services={filteredServices}
                onEdit={(id) => router.push(`/cms/services/${id}/edit`)}
                onDelete={(id) => {
                  setItemToDelete({ id, type: 'service' });
                  setDeleteDialogOpen(true);
                }}
                onRowClick={(id) => handleRowClick(id, 'service')}
              />
            </div>

            {/* Mobile View - Services Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service._id?.toString()}
                  service={service}
                  index={index}
                  onEdit={(id) => router.push(`/cms/services/${id}/edit`)}
                  onDelete={(id) => {
                    setItemToDelete({ id, type: 'service' });
                    setDeleteDialogOpen(true);
                  }}
                  onClick={(id) => handleRowClick(id, 'service')}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

"use client";

import { Product } from "@/app/models/products";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/skeleton-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

// Rupiah formatter function
const formatRupiah = (price: number) => {
  const priceString = price.toString();
  let result = "";
  let counter = 0;

  for (let i = priceString.length - 1; i >= 0; i--) {
    counter++;
    result = priceString[i] + result;
    if (counter % 3 === 0 && i !== 0) {
      result = "." + result;
    }
  }

  return `Rp ${result}`;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (productId: string) => {
    router.push(`/cms/products/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = products.filter((product) => product.name.toLowerCase().includes(searchLower) || product.kode.toLowerCase().includes(searchLower) || product.category.toLowerCase().includes(searchLower) || (product.description && product.description.toLowerCase().includes(searchLower)));
    setFilteredProducts(filtered);
  }, [debouncedSearch, products]);

  if (loading) return <TableSkeleton />;

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => productToDelete && handleDelete(productToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Halaman Produk</h1>
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Input type="text" placeholder="Cari produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Button onClick={() => router.push("/cms/products/add")} className="bg-blue-500 text-white hover:bg-blue-600">
              Tambah Produk
            </Button>
          </div>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead className="text-center">Kode</TableHead>
                <TableHead className="text-center">Nama Produk</TableHead>
                <TableHead className="text-center">Kategori</TableHead>
                <TableHead className="text-center">Deskripsi</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-center">Harga</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow
                  key={product._id?.toString()}
                  className="hover:cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    handleRowClick(product._id?.toString() || "");
                  }}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{product.kode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">{product.description?.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</div>
                  </TableCell>
                  <TableCell className="text-center">{product.jumlah}</TableCell>
                  <TableCell className="text-center">{formatRupiah(product.harga)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/cms/products/${product._id}/edit`);
                        }}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(product._id?.toString() || "");
                          setDeleteDialogOpen(true);
                        }}>
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="block sm:hidden">
          {filteredProducts.map((product, index) => (
            <div
              key={product._id?.toString()}
              className="bg-white px-4 py-5 border-b border-gray-200 space-y-3 hover:bg-gray-50 cursor-pointer"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                handleRowClick(product._id?.toString() || "");
              }}>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Stok: {product.jumlah}</div>
                <div className="text-sm text-gray-900">{formatRupiah(product.harga)}</div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/cms/products/${product._id}/edit`);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToDelete(product._id?.toString() || "");
                    setDeleteDialogOpen(true);
                  }}>
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

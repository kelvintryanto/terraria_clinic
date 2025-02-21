'use client';

import { Product } from '@/app/models/products';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [open, setOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      const productsArray = Array.isArray(data) ? data : [];

      setAllProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredProducts(allProducts);
        return;
      }
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300),
    [allProducts]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="w-full">
        <Input
          placeholder="Cari produk..."
          value={selectedProduct ? selectedProduct.name : searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setSelectedProduct(null);
            debouncedSearch(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full"
        />
      </div>

      {open && (
        <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <div className="relative">
            {isLoading ? (
              <div className="p-4 text-sm text-center">Memuat...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-sm text-center">
                Produk tidak ditemukan.
              </div>
            ) : (
              <div className="max-h-[200px] overflow-auto p-1">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id?.toString()}
                    className={cn(
                      'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                      selectedProduct?._id === product._id && 'bg-accent'
                    )}
                    onClick={() => {
                      setSelectedProduct(product);
                      setSearchTerm(product.name);
                      onSelect(product); // Pass the entire product object directly
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        selectedProduct?._id === product._id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{product.name}</span>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Kode: {product.kode}</span>
                        <span>•</span>
                        <span>Stok: {product.jumlah}</span>
                        <span>•</span>
                        <span>Harga: Rp {product.harga?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

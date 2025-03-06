'use client';

import { Product } from '@/app/models/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
  initialValue?: {
    _id?: string;
    name: string;
  };
}

export function ProductSearch({ onSelect, initialValue }: ProductSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue?.name || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue?.name || '');
  }, [initialValue]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm h-9"
        >
          <span className="truncate flex-1 text-left">
            {value || 'Pilih produk...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-[350px] p-0 max-h-[280px] sm:max-h-[350px]"
        align="start"
      >
        <div className="flex flex-col gap-1 p-1.5">
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
          <ScrollArea className="h-[200px] sm:h-[280px]">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">
                  Produk tidak ditemukan.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 p-1">
                {filteredProducts.map((product) => (
                  <Button
                    key={product._id?.toString()}
                    variant="ghost"
                    className="justify-start gap-1.5 h-fit py-2 px-2"
                    onClick={() => {
                      setValue(product.name);
                      onSelect(product);
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0',
                        value === product.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col items-start gap-1 min-w-0">
                      <span className="text-xs sm:text-sm truncate w-full">
                        {product.name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full">
                        Kode: {product.kode} • Stok: {product.jumlah} • Rp{' '}
                        {product.harga?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import { Dog } from '@/app/models/dog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface DogSearchProps {
  Dogs: Dog[];
  onSelect: (dog: Dog) => void;
  initialValue?: string;
}

export default function DogSearchInput({
  Dogs,
  onSelect,
  initialValue,
}: DogSearchProps) {
  const [open, setOpen] = useState(false);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialValue || '');
  const allDogs = Dogs;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only reset searchTerm if no initialValue is provided and Dogs change
    if (!initialValue) {
      setSearchTerm('');
    }
    setFilteredDogs(allDogs);
  }, [allDogs, initialValue]);

  // Update searchTerm when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredDogs(allDogs);
        return;
      }
      const filtered = allDogs.filter((dog) =>
        dog.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredDogs(filtered);
    }, 300),
    [allDogs]
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
    <div className="relative w-full" ref={containerRef}>
      <div className="w-full">
        <Label htmlFor="search-dog">Cari Anjing</Label>
        <Input
          id="search-dog"
          placeholder="Cari Anjing..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 100);
          }}
          className="w-full"
          autoComplete="off"
        />

        {open && (
          <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
            <div className="relative">
              {filteredDogs.length === 0 ? (
                <div className="p-4 text-sm text-center">
                  Anjing tidak ditemukan
                </div>
              ) : (
                <div className="max-h-[200px] overflow-auto p-1">
                  {filteredDogs.map((dog) => (
                    <div
                      key={dog._id?.toString()}
                      className={
                        'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
                      }
                      onClick={() => {
                        setSearchTerm(dog.name);
                        setFilteredDogs(allDogs);
                        onSelect(dog);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{dog.name}</span>
                        <div className="text-xs text-muted-foreground">
                          <span>{dog.age} years</span>
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
    </div>
  );
}

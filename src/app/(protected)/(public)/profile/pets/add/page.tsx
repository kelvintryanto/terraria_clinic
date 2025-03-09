'use client';

import { Breed } from '@/app/models/breed';
import { DogForm, initialDogForm } from '@/components/cms/customer/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddPetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [dogForm, setDogForm] = useState<DogForm>(initialDogForm);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [breedSearch, setBreedSearch] = useState('');
  const [isBreedOpen, setIsBreedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds');
        if (!response.ok) throw new Error('Failed to fetch breeds');

        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        toast({
          title: 'Kesalahan',
          description: 'Gagal memuat data ras',
          variant: 'destructive',
        });
      }
    };

    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        if (data.user && data.user.id) {
          setUserId(data.user.id);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: 'Kesalahan',
          description: 'Gagal memuat data pengguna',
          variant: 'destructive',
        });
      }
    };

    fetchBreeds();
    fetchUserId();
  }, [toast]);

  const handleAddDog = async () => {
    if (!userId) {
      toast({
        title: 'Kesalahan',
        description: 'Pengguna tidak ditemukan. Silakan coba lagi nanti.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/customers/${userId}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to add pet');
      }

      toast({
        title: 'Berhasil',
        description: 'Hewan peliharaan Anda telah berhasil ditambahkan',
      });

      // Redirect to the pets page
      router.push('/profile/pets');
    } catch (error) {
      console.error('Error adding pet:', error);
      toast({
        title: 'Kesalahan',
        description: 'Gagal menambahkan hewan peliharaan Anda',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-2 sm:p-0"
    >
      <Button
        variant="ghost"
        className="mb-4 sm:mb-6 gap-2 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-400 hover:text-white transition-all"
        onClick={() => router.push('/profile')}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Profil
      </Button>

      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-violet-500/10 shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
          Tambah Hewan Peliharaan Baru
        </h1>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-name"
                className="text-white text-sm sm:text-base"
              >
                Nama
              </Label>
              <Input
                id="dog-name"
                value={dogForm.name}
                onChange={(e) =>
                  setDogForm({ ...dogForm, name: e.target.value })
                }
                placeholder="Nama hewan"
                className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-breed"
                className="text-white text-sm sm:text-base"
              >
                Ras
              </Label>
              <div className="relative">
                <Input
                  id="dog-breed"
                  value={breedSearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBreedSearch(value);

                    // Check if input matches any breed
                    const matchingBreed = breeds.find(
                      (breed) =>
                        breed.name.toLowerCase() === value.toLowerCase()
                    );

                    if (matchingBreed) {
                      setDogForm({
                        ...dogForm,
                        breedId: matchingBreed._id.toString(),
                        customBreed: null,
                      });
                    } else {
                      setDogForm({
                        ...dogForm,
                        breedId: null,
                        customBreed: value || null,
                      });
                    }
                  }}
                  onFocus={() => setIsBreedOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsBreedOpen(false), 200);
                  }}
                  placeholder="Cari atau masukkan ras"
                  className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm"
                />
                {isBreedOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-1 rounded-md border bg-violet-900/90 border-violet-700 shadow-md z-50">
                    <Command className="bg-transparent">
                      <CommandList>
                        <CommandEmpty className="py-2 text-center text-sm text-white/60">
                          Tidak ada ras yang cocok
                        </CommandEmpty>
                        <CommandGroup className="max-h-[150px] sm:max-h-[200px] overflow-y-auto">
                          {breeds
                            .filter((breed) =>
                              breed.name
                                .toLowerCase()
                                .includes(breedSearch.toLowerCase())
                            )
                            .map((breed) => (
                              <CommandItem
                                key={breed._id.toString()}
                                value={breed.name}
                                onSelect={() => {
                                  setDogForm({
                                    ...dogForm,
                                    breedId: breed._id.toString(),
                                    customBreed: null,
                                  });
                                  setBreedSearch(breed.name);
                                  setIsBreedOpen(false);
                                }}
                                className="cursor-pointer text-white hover:bg-violet-700 text-sm py-1"
                              >
                                {breed.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-birth-year"
                className="text-white text-sm sm:text-base"
              >
                Tahun Lahir
              </Label>
              <Select
                value={dogForm.birthYear}
                onValueChange={(value: string) =>
                  setDogForm({ ...dogForm, birthYear: value })
                }
              >
                <SelectTrigger
                  id="dog-birth-year"
                  className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm"
                >
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 21 }, (_, i) => {
                    const year = (new Date().getFullYear() - i).toString();
                    return (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-birth-month"
                className="text-white text-sm sm:text-base"
              >
                Bulan Lahir
              </Label>
              <Select
                value={dogForm.birthMonth}
                onValueChange={(value: string) =>
                  setDogForm({ ...dogForm, birthMonth: value })
                }
              >
                <SelectTrigger
                  id="dog-birth-month"
                  className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm"
                >
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthNumber = (i + 1).toString();
                    const monthName = new Date(2000, i, 1).toLocaleString(
                      'id-ID',
                      { month: 'long' }
                    );
                    return (
                      <SelectItem key={monthNumber} value={monthNumber}>
                        {monthName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-color"
                className="text-white text-sm sm:text-base"
              >
                Warna
              </Label>
              <Input
                id="dog-color"
                value={dogForm.color}
                onChange={(e) =>
                  setDogForm({ ...dogForm, color: e.target.value })
                }
                placeholder="Warna hewan"
                className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-weight"
                className="text-white text-sm sm:text-base"
              >
                Berat (kg)
              </Label>
              <Input
                id="dog-weight"
                type="number"
                step="0.1"
                value={dogForm.weight || ''}
                onChange={(e) =>
                  setDogForm({
                    ...dogForm,
                    weight: e.target.value ? parseFloat(e.target.value) : 0,
                  })
                }
                placeholder="Berat hewan"
                className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-sex"
                className="text-white text-sm sm:text-base"
              >
                Jenis Kelamin
              </Label>
              <Select
                value={dogForm.sex}
                onValueChange={(value: 'male' | 'female') =>
                  setDogForm({ ...dogForm, sex: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Jantan</SelectItem>
                  <SelectItem value="female">Betina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-vaccine"
                className="text-white text-sm sm:text-base"
              >
                Tanggal Vaksin Terakhir
              </Label>
              <div className="flex gap-1 sm:gap-2">
                <Input
                  id="dog-vaccine"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  defaultValue={
                    dogForm.lastVaccineDate
                      ? format(new Date(dogForm.lastVaccineDate), 'dd/MM/yyyy')
                      : ''
                  }
                  onChange={(e) => {
                    const input = e.target;
                    const value = input.value;
                    const prevValue =
                      input.getAttribute('data-prev-value') || '';

                    // Store current value for next comparison
                    input.setAttribute('data-prev-value', value);

                    // Check if user is deleting characters
                    const isDeletion = value.length < prevValue.length;

                    // Only allow digits and slashes
                    const cleaned = value.replace(/[^\d/]/g, '');

                    // Handle formatting
                    let formatted = cleaned;

                    if (isDeletion) {
                      // Special handling for deletion
                      if (prevValue.endsWith('/') && !value.endsWith('/')) {
                        // If deleting right after a slash, remove the slash too
                        formatted = value.substring(0, value.length - 1);
                      } else if (
                        value.length === 3 &&
                        value.charAt(2) === '/'
                      ) {
                        // If only one digit left before the first slash, remove the slash too
                        formatted = value.substring(0, 2);
                      } else if (
                        value.length === 6 &&
                        value.charAt(5) === '/'
                      ) {
                        // If only one digit left before the second slash, remove the slash too
                        formatted = value.substring(0, 5);
                      }
                    } else {
                      // Auto-add slashes when typing
                      if (cleaned.length === 2 && !cleaned.includes('/')) {
                        formatted = cleaned + '/';
                      } else if (
                        cleaned.length === 5 &&
                        cleaned.indexOf('/', 3) === -1
                      ) {
                        formatted = cleaned + '/';
                      }
                    }

                    // Update the input value if it's different
                    if (formatted !== value) {
                      input.value = formatted;
                      // Update the stored previous value after programmatic change
                      input.setAttribute('data-prev-value', formatted);
                    }

                    // Parse the date if it's in the correct format
                    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                    const match = formatted.match(datePattern);

                    if (match) {
                      const day = parseInt(match[1]);
                      const month = parseInt(match[2]) - 1; // JS months are 0-indexed
                      const year = parseInt(match[3]);

                      const date = new Date(year, month, day);

                      // Check if it's a valid date
                      if (!isNaN(date.getTime())) {
                        setDogForm({
                          ...dogForm,
                          lastVaccineDate: date.toISOString(),
                        });
                      }
                    } else if (formatted === '') {
                      // Clear the date if input is empty
                      setDogForm({ ...dogForm, lastVaccineDate: null });
                    }
                  }}
                  className="bg-white/10 border-white/20 text-white flex-1 h-9 sm:h-10 text-sm"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 sm:h-10 w-9 sm:w-10"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={
                        dogForm.lastVaccineDate
                          ? new Date(dogForm.lastVaccineDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        setDogForm({
                          ...dogForm,
                          lastVaccineDate: date ? date.toISOString() : null,
                        });

                        // Update the input field directly
                        if (date) {
                          const input = document.getElementById(
                            'dog-vaccine'
                          ) as HTMLInputElement;
                          if (input) {
                            input.value = format(date, 'dd/MM/yyyy');
                          }
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="dog-deworm"
                className="text-white text-sm sm:text-base"
              >
                Tanggal Obat Cacing Terakhir
              </Label>
              <div className="flex gap-1 sm:gap-2">
                <Input
                  id="dog-deworm"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  defaultValue={
                    dogForm.lastDewormDate
                      ? format(new Date(dogForm.lastDewormDate), 'dd/MM/yyyy')
                      : ''
                  }
                  onChange={(e) => {
                    const input = e.target;
                    const value = input.value;
                    const prevValue =
                      input.getAttribute('data-prev-value') || '';

                    // Store current value for next comparison
                    input.setAttribute('data-prev-value', value);

                    // Check if user is deleting characters
                    const isDeletion = value.length < prevValue.length;

                    // Only allow digits and slashes
                    const cleaned = value.replace(/[^\d/]/g, '');

                    // Handle formatting
                    let formatted = cleaned;

                    if (isDeletion) {
                      // Special handling for deletion
                      if (prevValue.endsWith('/') && !value.endsWith('/')) {
                        // If deleting right after a slash, remove the slash too
                        formatted = value.substring(0, value.length - 1);
                      } else if (
                        value.length === 3 &&
                        value.charAt(2) === '/'
                      ) {
                        // If only one digit left before the first slash, remove the slash too
                        formatted = value.substring(0, 2);
                      } else if (
                        value.length === 6 &&
                        value.charAt(5) === '/'
                      ) {
                        // If only one digit left before the second slash, remove the slash too
                        formatted = value.substring(0, 5);
                      }
                    } else {
                      // Auto-add slashes when typing
                      if (cleaned.length === 2 && !cleaned.includes('/')) {
                        formatted = cleaned + '/';
                      } else if (
                        cleaned.length === 5 &&
                        cleaned.indexOf('/', 3) === -1
                      ) {
                        formatted = cleaned + '/';
                      }
                    }

                    // Update the input value if it's different
                    if (formatted !== value) {
                      input.value = formatted;
                      // Update the stored previous value after programmatic change
                      input.setAttribute('data-prev-value', formatted);
                    }

                    // Parse the date if it's in the correct format
                    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                    const match = formatted.match(datePattern);

                    if (match) {
                      const day = parseInt(match[1]);
                      const month = parseInt(match[2]) - 1; // JS months are 0-indexed
                      const year = parseInt(match[3]);

                      const date = new Date(year, month, day);

                      // Check if it's a valid date
                      if (!isNaN(date.getTime())) {
                        setDogForm({
                          ...dogForm,
                          lastDewormDate: date.toISOString(),
                        });
                      }
                    } else if (formatted === '') {
                      // Clear the date if input is empty
                      setDogForm({ ...dogForm, lastDewormDate: null });
                    }
                  }}
                  className="bg-white/10 border-white/20 text-white flex-1 h-9 sm:h-10 text-sm"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 sm:h-10 w-9 sm:w-10"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={
                        dogForm.lastDewormDate
                          ? new Date(dogForm.lastDewormDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        setDogForm({
                          ...dogForm,
                          lastDewormDate: date ? date.toISOString() : null,
                        });

                        // Update the input field directly
                        if (date) {
                          const input = document.getElementById(
                            'dog-deworm'
                          ) as HTMLInputElement;
                          if (input) {
                            input.value = format(date, 'dd/MM/yyyy');
                          }
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
          <Button
            onClick={handleAddDog}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white w-full sm:w-auto px-6"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah Hewan'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

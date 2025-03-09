'use client';

import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Camera,
  Check,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function EditDogPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dog, setDog] = useState<Dog | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [breedSearch, setBreedSearch] = useState('');
  const [isBreedOpen, setIsBreedOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [dogForm, setDogForm] = useState({
    name: '',
    breedId: null as string | null,
    customBreed: null as string | null,
    birthYear: '',
    birthMonth: '',
    color: '',
    weight: 0,
    lastVaccineDate: null as string | null,
    lastDewormDate: null as string | null,
    sex: 'male' as 'male' | 'female',
    profileImage: '' as string | undefined,
  });

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        setLoading(true);

        // Get current user data
        const userResponse = await fetch('/api/users/me');
        const userData = await userResponse.json();

        if (!userData.user || !userData.user.id) {
          throw new Error('Pengguna tidak ditemukan');
        }

        setUserId(userData.user.id);

        // Get customer data that contains dogs
        const customerResponse = await fetch(
          `/api/customers/${userData.user.id}`
        );
        if (!customerResponse.ok) {
          throw new Error('Gagal mengambil data pelanggan');
        }

        const customerData = await customerResponse.json();

        // Find the specific dog by ID
        const foundDog = customerData.customer.dogs?.find(
          (d: Dog) => d._id.toString() === id
        );
        if (!foundDog) {
          throw new Error('Anjing tidak ditemukan');
        }

        setDog(foundDog);

        // Initialize form with dog data
        setDogForm({
          name: foundDog.name,
          breedId: foundDog.breedId ? foundDog.breedId.toString() : null,
          customBreed: foundDog.customBreed,
          birthYear: foundDog.birthYear,
          birthMonth: foundDog.birthMonth,
          color: foundDog.color,
          weight: foundDog.weight,
          lastVaccineDate: foundDog.lastVaccineDate,
          lastDewormDate: foundDog.lastDewormDate,
          sex: foundDog.sex,
          profileImage: foundDog.profileImage,
        });

        // Set breed search if there's a custom breed
        if (foundDog.customBreed) {
          setBreedSearch(foundDog.customBreed);
        }

        // Fetch breeds for displaying breed name
        const breedsResponse = await fetch('/api/breeds');
        const breedsData = await breedsResponse.json();
        setBreeds(breedsData);

        // Set breed search if there's a breed ID
        if (foundDog.breedId) {
          const breedName = breedsData.find(
            (b: Breed) => b._id.toString() === foundDog.breedId?.toString()
          )?.name;
          if (breedName) {
            setBreedSearch(breedName);
          }
        }
      } catch (err) {
        console.error('Error fetching dog data:', err);
        setError(
          err instanceof Error ? err.message : 'Gagal memuat data anjing'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDogData();
  }, [id]);

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: 'Kesalahan',
        description: 'Pengguna tidak ditemukan. Silakan coba lagi nanti.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/customers/${userId}/dogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update pet');
      }

      toast({
        title: 'Berhasil',
        description: 'Hewan peliharaan Anda telah berhasil diperbarui',
      });

      router.push(`/profile/pets/${id}`);
    } catch (error) {
      console.error('Error updating pet:', error);
      toast({
        title: 'Kesalahan',
        description: 'Gagal memperbarui hewan peliharaan Anda',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('dogId', id);
      formData.append('customerId', userId);

      const response = await fetch('/api/dogs/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Update the form and dog state with the new image URL
      setDogForm((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));

      if (dog) {
        setDog({
          ...dog,
          profileImage: data.imageUrl,
        });
      }

      toast({
        title: 'Berhasil',
        description: 'Foto profil hewan berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Kesalahan',
        description: 'Gagal mengunggah foto profil',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="gap-2" disabled>
            <ArrowLeft size={16} />
            Kembali
          </Button>
        </div>

        <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="w-24 sm:w-32 h-24 sm:h-32 rounded-xl" />
            <div className="flex-1 space-y-6 w-full">
              <div>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="w-full space-y-8">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push('/profile/pets')}
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Anjing
        </Button>

        <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 border border-red-500/10 text-center">
          <p className="text-red-200">{error || 'Anjing tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push(`/profile/pets/${id}`)}
        >
          <ArrowLeft size={16} />
          Kembali ke Detail Anjing
        </Button>
      </div>

      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Anjing</h1>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <Avatar className="w-32 h-32 rounded-xl border-2 border-white/20">
                {dogForm.profileImage ? (
                  <AvatarImage
                    src={dogForm.profileImage}
                    alt={dogForm.name}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white">
                    {dogForm.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white h-8 w-8" />
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-white/20 border-t-white rounded-full"></div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-white/70 text-sm mt-2">
              Klik untuk mengganti foto
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nama
            </Label>
            <Input
              id="name"
              value={dogForm.name}
              onChange={(e) => setDogForm({ ...dogForm, name: e.target.value })}
              placeholder="Nama anjing"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <Label htmlFor="breed" className="text-white">
              Ras
            </Label>
            <div className="relative">
              <Input
                id="breed"
                value={breedSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setBreedSearch(value);

                  // Check if input matches any breed
                  const matchingBreed = breeds.find(
                    (breed) => breed.name.toLowerCase() === value.toLowerCase()
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
                className="bg-white/10 border-white/20 text-white"
              />
              {isBreedOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 p-1 rounded-md border bg-violet-900/90 border-violet-700 shadow-md z-50">
                  <Command className="bg-transparent">
                    <CommandList>
                      <CommandEmpty className="py-2 text-center text-sm text-white/60">
                        Tidak ada ras yang cocok
                      </CommandEmpty>
                      <CommandGroup className="max-h-[150px] overflow-y-auto">
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

          {/* Birth Year and Month */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthYear" className="text-white">
                Tahun Lahir
              </Label>
              <Input
                id="birthYear"
                value={dogForm.birthYear}
                onChange={(e) =>
                  setDogForm({ ...dogForm, birthYear: e.target.value })
                }
                placeholder="Tahun lahir"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthMonth" className="text-white">
                Bulan Lahir
              </Label>
              <Select
                value={dogForm.birthMonth}
                onValueChange={(value) =>
                  setDogForm({ ...dogForm, birthMonth: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Januari</SelectItem>
                  <SelectItem value="2">Februari</SelectItem>
                  <SelectItem value="3">Maret</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">Mei</SelectItem>
                  <SelectItem value="6">Juni</SelectItem>
                  <SelectItem value="7">Juli</SelectItem>
                  <SelectItem value="8">Agustus</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color" className="text-white">
                Warna
              </Label>
              <Input
                id="color"
                value={dogForm.color}
                onChange={(e) =>
                  setDogForm({ ...dogForm, color: e.target.value })
                }
                placeholder="Warna anjing"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-white">
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={dogForm.weight.toString()}
                onChange={(e) =>
                  setDogForm({
                    ...dogForm,
                    weight: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Berat anjing"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <Label className="text-white">Jenis Kelamin</Label>
            <div className="flex gap-4">
              <div
                className={`flex-1 p-3 rounded-lg border cursor-pointer ${
                  dogForm.sex === 'male'
                    ? 'bg-violet-700/50 border-violet-500'
                    : 'bg-white/10 border-white/20'
                }`}
                onClick={() => setDogForm({ ...dogForm, sex: 'male' })}
              >
                <div className="flex items-center gap-2">
                  {dogForm.sex === 'male' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                  <span className="text-white">Jantan</span>
                </div>
              </div>
              <div
                className={`flex-1 p-3 rounded-lg border cursor-pointer ${
                  dogForm.sex === 'female'
                    ? 'bg-violet-700/50 border-violet-500'
                    : 'bg-white/10 border-white/20'
                }`}
                onClick={() => setDogForm({ ...dogForm, sex: 'female' })}
              >
                <div className="flex items-center gap-2">
                  {dogForm.sex === 'female' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                  <span className="text-white">Betina</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Vaccine Date */}
          <div className="space-y-2">
            <Label htmlFor="lastVaccineDate" className="text-white">
              Tanggal Vaksin Terakhir
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white ${
                    !dogForm.lastVaccineDate && 'text-white/50'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dogForm.lastVaccineDate ? (
                    format(new Date(dogForm.lastVaccineDate), 'PPP')
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    dogForm.lastVaccineDate
                      ? new Date(dogForm.lastVaccineDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    setDogForm({
                      ...dogForm,
                      lastVaccineDate: date ? date.toISOString() : null,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Last Deworm Date */}
          <div className="space-y-2">
            <Label htmlFor="lastDewormDate" className="text-white">
              Tanggal Obat Cacing Terakhir
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white ${
                    !dogForm.lastDewormDate && 'text-white/50'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dogForm.lastDewormDate ? (
                    format(new Date(dogForm.lastDewormDate), 'PPP')
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    dogForm.lastDewormDate
                      ? new Date(dogForm.lastDewormDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    setDogForm({
                      ...dogForm,
                      lastDewormDate: date ? date.toISOString() : null,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

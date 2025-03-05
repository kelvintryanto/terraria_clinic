'use client';

import { Breed } from '@/app/models/breed';
import { AddDogInput } from '@/app/models/dog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<AddDogInput[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [showBreeds, setShowBreeds] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds');
        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };
    fetchBreeds();
  }, []);

  const addDog = () => {
    setDogs([
      ...dogs,
      {
        name: '',
        breedId: null,
        customBreed: '',
        age: 0,
        color: '',
        weight: 0,
        lastVaccineDate: null,
        lastDewormDate: null,
        sex: 'male',
      },
    ]);
  };

  const updateDog = (
    index: number,
    field: keyof AddDogInput,
    value: string | number | null
  ) => {
    const newDogs = [...dogs];
    newDogs[index] = { ...newDogs[index], [field]: value };
    setDogs(newDogs);
  };

  const calculateAge = (birthYear: string, birthMonth: string) => {
    if (!birthYear || !birthMonth) return 0;

    const today = new Date();
    const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Calculate decimal part for months
    const monthAge = monthDiff < 0 ? 12 + monthDiff : monthDiff;
    return age + monthAge / 12;
  };

  const getCurrentYearMonth = (age: number) => {
    if (age === 0) return { year: '', month: '' };

    const today = new Date();
    const totalMonths = Math.floor(age * 12);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const birthYear = today.getFullYear() - years;
    const birthMonth = today.getMonth() - months + 1;

    // Adjust for negative or overflow months
    let adjustedYear = birthYear;
    let adjustedMonth = birthMonth;

    if (birthMonth < 1) {
      adjustedYear--;
      adjustedMonth = 12 + birthMonth;
    } else if (birthMonth > 12) {
      adjustedYear++;
      adjustedMonth = birthMonth - 12;
    }

    return {
      year: adjustedYear.toString(),
      month: adjustedMonth.toString().padStart(2, '0'),
    };
  };

  const removeDog = (index: number) => {
    setDogs(dogs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const validDogs = dogs.filter(
        (dog) =>
          dog.name && (dog.breedId || dog.customBreed) && dog.age && dog.color
      );

      const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        role: 'customer',
        joinDate: new Date().toISOString(),
        dogs: validDogs.map((dog) => ({
          name: dog.name,
          breedId: dog.breedId === 'custom' ? null : dog.breedId,
          customBreed:
            dog.breedId === 'custom' || !dog.breedId ? dog.customBreed : null,
          age: Number(dog.age) || 0,
          color: dog.color,
          weight: parseFloat(String(dog.weight)) || 0,
          lastVaccineDate: dog.lastVaccineDate || null,
          lastDewormDate: dog.lastDewormDate || null,
          sex: dog.sex,
        })),
      };

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menambahkan pelanggan');
      }

      toast({
        title: 'Berhasil',
        description: 'Pelanggan berhasil ditambahkan',
        variant: 'default',
      });
      router.push('/cms/customer?success=created');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: 'Gagal',
        description: 'Gagal menambahkan pelanggan',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-5">
      <h1 className="text-2xl font-bold mb-6">Tambah Pelanggan Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nama pelanggan"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
            />
          </div>

          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Nomor telepon"
            />
          </div>

          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              placeholder="Alamat lengkap"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Anjing</h2>
            <Button
              type="button"
              onClick={addDog}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Tambah Anjing
            </Button>
          </div>

          {dogs.map((dog, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Anjing #{index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeDog(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama</Label>
                  <Input
                    name={`dog-${index}-name`}
                    value={dog.name}
                    onChange={(e) => updateDog(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Ras</Label>
                  <div className="relative">
                    <Input
                      name={`dog-${index}-breed`}
                      value={dog.customBreed || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateDog(index, 'customBreed', value);
                        updateDog(index, 'breedId', null);
                        setShowBreeds((prev) => ({ ...prev, [index]: true }));
                      }}
                      onFocus={() => {
                        setShowBreeds((prev) => ({ ...prev, [index]: true }));
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowBreeds((prev) => ({
                            ...prev,
                            [index]: false,
                          }));
                        }, 200);
                      }}
                      placeholder="Cari atau masukkan ras anjing"
                      required
                    />
                    {showBreeds[index] && breeds.length > 0 && (
                      <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                        <div className="max-h-[200px] overflow-auto p-1">
                          {breeds
                            .filter((breed) =>
                              breed.name
                                .toLowerCase()
                                .includes((dog.customBreed || '').toLowerCase())
                            )
                            .map((breed) => (
                              <div
                                key={breed._id.toString()}
                                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  updateDog(
                                    index,
                                    'breedId',
                                    breed._id.toString()
                                  );
                                  updateDog(index, 'customBreed', breed.name);
                                  setShowBreeds((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                }}
                              >
                                {breed.name}
                              </div>
                            ))}
                          {breeds.filter((breed) =>
                            breed.name
                              .toLowerCase()
                              .includes((dog.customBreed || '').toLowerCase())
                          ).length === 0 && (
                            <div className="p-2 text-sm text-muted-foreground">
                              Ras tidak ditemukan, gunakan input sebagai ras
                              kustom
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Tahun Lahir</Label>
                  <Select
                    value={getCurrentYearMonth(dog.age).year || undefined}
                    onValueChange={(value) => {
                      const currentMonth =
                        getCurrentYearMonth(dog.age).month || '01';
                      const age = calculateAge(value, currentMonth);
                      updateDog(index, 'age', age);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 21 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bulan Lahir</Label>
                  <Select
                    value={getCurrentYearMonth(dog.age).month || undefined}
                    onValueChange={(value) => {
                      const currentYear =
                        getCurrentYearMonth(dog.age).year ||
                        new Date().getFullYear().toString();
                      const age = calculateAge(currentYear, value);
                      updateDog(index, 'age', age);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = i + 1;
                        const monthStr = month.toString().padStart(2, '0');
                        return (
                          <SelectItem key={month} value={monthStr}>
                            {new Date(2024, i).toLocaleString('id-ID', {
                              month: 'long',
                            })}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Warna</Label>
                  <Input
                    name={`dog-${index}-color`}
                    value={dog.color}
                    onChange={(e) => updateDog(index, 'color', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Berat (kg)</Label>
                  <Input
                    name={`dog-${index}-weight`}
                    type="number"
                    value={dog.weight || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateDog(
                        index,
                        'weight',
                        value === '' ? 0 : parseFloat(value)
                      );
                    }}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <Label>Jenis Kelamin</Label>
                  <Select
                    value={dog.sex}
                    onValueChange={(value) =>
                      updateDog(index, 'sex', value as 'male' | 'female')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Jantan</SelectItem>
                      <SelectItem value="female">Betina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tanggal Vaksin Terakhir</Label>
                  <Input
                    name={`dog-${index}-lastVaccineDate`}
                    type="date"
                    value={dog.lastVaccineDate || ''}
                    onChange={(e) =>
                      updateDog(index, 'lastVaccineDate', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Tanggal Obat Cacing Terakhir</Label>
                  <Input
                    name={`dog-${index}-lastDewormDate`}
                    type="date"
                    value={dog.lastDewormDate || ''}
                    onChange={(e) =>
                      updateDog(index, 'lastDewormDate', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </div>
  );
}

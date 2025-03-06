import { Breed } from '@/app/models/breed';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { DogForm } from './types';

interface AddDogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogForm: DogForm;
  setDogForm: (form: DogForm) => void;
  onAddDog: () => void;
  isSubmitting: boolean;
  breeds: Breed[];
}

export function AddDogDialog({
  open,
  onOpenChange,
  dogForm,
  setDogForm,
  onAddDog,
  isSubmitting,
  breeds,
}: AddDogDialogProps) {
  const [breedSearch, setBreedSearch] = useState('');
  const [isBreedOpen, setIsBreedOpen] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[calc(100%-1rem)] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Anjing Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail anjing di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:gap-6 py-2 sm:py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Left column - first 4 inputs */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-name">Nama</Label>
                <Input
                  id="dog-name"
                  value={dogForm.name}
                  onChange={(e) =>
                    setDogForm({ ...dogForm, name: e.target.value })
                  }
                  placeholder="Nama anjing"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-breed">Ras</Label>
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
                    placeholder="Ketik untuk mencari atau masukkan ras baru"
                    className="w-full h-9"
                  />
                  {isBreedOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 p-1 rounded-md border bg-popover shadow-md z-50">
                      <Command>
                        <CommandList>
                          <CommandEmpty className="py-2 text-center text-sm text-muted-foreground">
                            Tidak ada ras yang sesuai
                          </CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
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
                                  className="cursor-pointer"
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
              <div className="grid gap-1 sm:gap-2">
                <Label>Tahun Lahir</Label>
                <Select
                  value={getCurrentYearMonth(dogForm.age).year || undefined}
                  onValueChange={(value) => {
                    const currentMonth =
                      getCurrentYearMonth(dogForm.age).month || '01';
                    const age = calculateAge(value, currentMonth);
                    setDogForm({
                      ...dogForm,
                      age: age,
                    });
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
              <div className="grid gap-1 sm:gap-2">
                <Label>Bulan Lahir</Label>
                <Select
                  value={getCurrentYearMonth(dogForm.age).month || undefined}
                  onValueChange={(value) => {
                    const currentYear =
                      getCurrentYearMonth(dogForm.age).year ||
                      new Date().getFullYear().toString();
                    const age = calculateAge(currentYear, value);
                    setDogForm({
                      ...dogForm,
                      age: age,
                    });
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
            </div>

            {/* Right column - last 4 inputs */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-color">Warna</Label>
                <Input
                  id="dog-color"
                  value={dogForm.color}
                  onChange={(e) =>
                    setDogForm({ ...dogForm, color: e.target.value })
                  }
                  placeholder="Warna anjing"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-weight">Berat (kg)</Label>
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
                  placeholder="Berat anjing"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-sex">Jenis Kelamin</Label>
                <Select
                  value={dogForm.sex}
                  onValueChange={(value: 'male' | 'female') =>
                    setDogForm({ ...dogForm, sex: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Jantan</SelectItem>
                    <SelectItem value="female">Betina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-vaccine">Tanggal Vaksin Terakhir</Label>
                <Input
                  id="dog-vaccine"
                  type="date"
                  value={dogForm.lastVaccineDate || ''}
                  onChange={(e) =>
                    setDogForm({
                      ...dogForm,
                      lastVaccineDate: e.target.value || null,
                    })
                  }
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-deworm">Tanggal Obat Cacing Terakhir</Label>
                <Input
                  id="dog-deworm"
                  type="date"
                  value={dogForm.lastDewormDate || ''}
                  onChange={(e) =>
                    setDogForm({
                      ...dogForm,
                      lastDewormDate: e.target.value || null,
                    })
                  }
                  className="h-9"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setBreedSearch('');
            }}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            onClick={onAddDog}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

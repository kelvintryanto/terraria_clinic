import { Breed } from '@/app/models/breed';
import { formatDogAge } from '@/app/utils/format';
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
import { useToast } from '@/hooks/use-toast';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Generate year options (current year down to 20 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) =>
    (currentYear - i).toString()
  );

  // Generate month options (1-12) with month names
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
  }));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!dogForm.name.trim()) {
      newErrors.name = 'Nama anjing harus diisi';
    }

    if (!dogForm.breedId && !dogForm.customBreed) {
      newErrors.breed = 'Ras anjing harus diisi';
    }

    if (!dogForm.birthYear) {
      newErrors.birthYear = 'Tahun lahir harus dipilih';
    }

    if (!dogForm.birthMonth) {
      newErrors.birthMonth = 'Bulan lahir harus dipilih';
    }

    if (!dogForm.color.trim()) {
      newErrors.color = 'Warna anjing harus diisi';
    }

    if (dogForm.weight <= 0) {
      newErrors.weight = 'Berat anjing harus lebih dari 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddDog();
    } else {
      toast({
        title: 'Validasi Gagal',
        description: 'Silakan lengkapi semua data yang diperlukan',
        variant: 'destructive',
      });
    }
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:gap-6 py-2 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Left column - first 4 inputs */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="dog-name" className="flex justify-between">
                    <span>
                      Nama <span className="text-red-500">*</span>
                    </span>
                    {errors.name && (
                      <span className="text-xs text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="dog-name"
                    value={dogForm.name}
                    onChange={(e) =>
                      setDogForm({ ...dogForm, name: e.target.value })
                    }
                    placeholder="Nama anjing"
                    className={`h-9 ${errors.name ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="dog-breed" className="flex justify-between">
                    <span>
                      Ras <span className="text-red-500">*</span>
                    </span>
                    {errors.breed && (
                      <span className="text-xs text-red-500">
                        {errors.breed}
                      </span>
                    )}
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
                      placeholder="Ketik untuk mencari atau masukkan ras baru"
                      className={`w-full h-9 ${
                        errors.breed ? 'border-red-500' : ''
                      }`}
                      required
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1 sm:gap-2">
                    <Label htmlFor="birthYear" className="flex justify-between">
                      <span>
                        Tahun Lahir <span className="text-red-500">*</span>
                      </span>
                      {errors.birthYear && (
                        <span className="text-xs text-red-500">
                          {errors.birthYear}
                        </span>
                      )}
                    </Label>
                    <Select
                      value={dogForm.birthYear || undefined}
                      onValueChange={(value) => {
                        setDogForm({
                          ...dogForm,
                          birthYear: value,
                        });
                      }}
                      required
                    >
                      <SelectTrigger
                        className={`${
                          errors.birthYear ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-1 sm:gap-2">
                    <Label
                      htmlFor="birthMonth"
                      className="flex justify-between"
                    >
                      <span>
                        Bulan Lahir <span className="text-red-500">*</span>
                      </span>
                      {errors.birthMonth && (
                        <span className="text-xs text-red-500">
                          {errors.birthMonth}
                        </span>
                      )}
                    </Label>
                    <Select
                      value={dogForm.birthMonth || undefined}
                      onValueChange={(value) => {
                        setDogForm({
                          ...dogForm,
                          birthMonth: value,
                        });
                      }}
                      required
                    >
                      <SelectTrigger
                        className={`${
                          errors.birthMonth ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Pilih bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {dogForm.birthYear && dogForm.birthMonth && (
                  <div className="mt-2">
                    <Label>Umur (Kalkulasi)</Label>
                    <div className="text-sm text-muted-foreground">
                      {formatDogAge(dogForm.birthYear, dogForm.birthMonth)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - last 4 inputs */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="dog-color" className="flex justify-between">
                    <span>
                      Warna <span className="text-red-500">*</span>
                    </span>
                    {errors.color && (
                      <span className="text-xs text-red-500">
                        {errors.color}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="dog-color"
                    value={dogForm.color}
                    onChange={(e) =>
                      setDogForm({ ...dogForm, color: e.target.value })
                    }
                    placeholder="Warna anjing"
                    className={`h-9 ${errors.color ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="dog-weight" className="flex justify-between">
                    <span>
                      Berat (kg) <span className="text-red-500">*</span>
                    </span>
                    {errors.weight && (
                      <span className="text-xs text-red-500">
                        {errors.weight}
                      </span>
                    )}
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
                    placeholder="Berat anjing"
                    className={`h-9 ${errors.weight ? 'border-red-500' : ''}`}
                    required
                    min="0.1"
                  />
                </div>
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="dog-sex">
                    <span>
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </span>
                  </Label>
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
                  <Label htmlFor="dog-deworm">
                    Tanggal Obat Cacing Terakhir
                  </Label>
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
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setBreedSearch('');
                setErrors({});
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Menambahkan...' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

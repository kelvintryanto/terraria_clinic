import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { Button } from '@/components/ui/button';
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

interface EditDogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dog: Dog;
  breeds: Breed[];
  onSave: (updatedDog: EditDogForm) => void;
  isSubmitting: boolean;
}

type EditDogForm = Omit<Partial<Dog>, 'breedId'> & {
  breedId?: string;
};

export function EditDogDialog({
  open,
  onOpenChange,
  dog,
  breeds,
  onSave,
  isSubmitting,
}: EditDogDialogProps) {
  const [editForm, setEditForm] = useState<EditDogForm>({
    name: dog.name,
    breedId: dog.breedId?.toString(),
    customBreed: dog.customBreed || '',
    birthYear: dog.birthYear,
    birthMonth: dog.birthMonth,
    color: dog.color,
    weight: dog.weight,
    sex: dog.sex,
    lastVaccineDate: dog.lastVaccineDate,
    lastDewormDate: dog.lastDewormDate,
  });
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

    if (!editForm.name?.trim()) {
      newErrors.name = 'Nama anjing harus diisi';
    }

    if (!editForm.breedId && !editForm.customBreed) {
      newErrors.breed = 'Ras anjing harus diisi';
    }

    if (!editForm.birthYear) {
      newErrors.birthYear = 'Tahun lahir harus dipilih';
    }

    if (!editForm.birthMonth) {
      newErrors.birthMonth = 'Bulan lahir harus dipilih';
    }

    if (!editForm.color?.trim()) {
      newErrors.color = 'Warna anjing harus diisi';
    }

    if (!editForm.weight || editForm.weight <= 0) {
      newErrors.weight = 'Berat anjing harus lebih dari 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(editForm);
    } else {
      toast({
        title: 'Validasi Gagal',
        description: 'Silakan lengkapi semua data yang diperlukan',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setErrors({});
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[800px] w-[calc(100%-1rem)] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Anjing</DialogTitle>
          <DialogDescription>
            Ubah detail anjing di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:gap-6 py-2 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Left column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="name" className="flex justify-between">
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
                    id="name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Nama anjing"
                    className={`h-9 ${errors.name ? 'border-red-500' : ''}`}
                    required
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="breed" className="flex justify-between">
                    <span>
                      Ras <span className="text-red-500">*</span>
                    </span>
                    {errors.breed && (
                      <span className="text-xs text-red-500">
                        {errors.breed}
                      </span>
                    )}
                  </Label>
                  <Select
                    value={editForm.breedId || 'other'}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({
                        ...prev,
                        breedId: value === 'other' ? undefined : value,
                        customBreed: '',
                      }))
                    }
                    required
                  >
                    <SelectTrigger
                      className={`h-9 ${errors.breed ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Pilih ras" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="other">Lainnya</SelectItem>
                      {breeds.map((breed) => (
                        <SelectItem
                          key={breed._id.toString()}
                          value={breed._id.toString()}
                        >
                          {breed.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!editForm.breedId && (
                  <div className="grid gap-1 sm:gap-2">
                    <Label
                      htmlFor="customBreed"
                      className="flex justify-between"
                    >
                      <span>
                        Ras Lainnya <span className="text-red-500">*</span>
                      </span>
                      {errors.breed && (
                        <span className="text-xs text-red-500">
                          {errors.breed}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="customBreed"
                      value={editForm.customBreed || ''}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          customBreed: e.target.value,
                        }))
                      }
                      placeholder="Masukkan ras"
                      className={`h-9 ${errors.breed ? 'border-red-500' : ''}`}
                      required={!editForm.breedId}
                    />
                  </div>
                )}

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
                      value={editForm.birthYear}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          birthYear: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger
                        className={`h-9 ${
                          errors.birthYear ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Tahun" />
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
                      value={editForm.birthMonth}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          birthMonth: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger
                        className={`h-9 ${
                          errors.birthMonth ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Bulan" />
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

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="sex">
                    <span>
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <Select
                    value={editForm.sex}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({
                        ...prev,
                        sex: value as 'male' | 'female',
                      }))
                    }
                    required
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
              </div>

              {/* Right column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="color" className="flex justify-between">
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
                    id="color"
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    placeholder="Warna anjing"
                    className={`h-9 ${errors.color ? 'border-red-500' : ''}`}
                    required
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="weight" className="flex justify-between">
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
                    id="weight"
                    type="number"
                    step="0.1"
                    value={editForm.weight || ''}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        weight: e.target.value ? parseFloat(e.target.value) : 0,
                      }))
                    }
                    placeholder="Berat anjing"
                    className={`h-9 ${errors.weight ? 'border-red-500' : ''}`}
                    required
                    min="0.1"
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="lastVaccineDate">
                    Tanggal Vaksin Terakhir
                  </Label>
                  <Input
                    id="lastVaccineDate"
                    type="date"
                    value={editForm.lastVaccineDate || ''}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        lastVaccineDate: e.target.value || null,
                      }))
                    }
                    className="h-9"
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="lastDewormDate">
                    Tanggal Obat Cacing Terakhir
                  </Label>
                  <Input
                    id="lastDewormDate"
                    type="date"
                    value={editForm.lastDewormDate || ''}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        lastDewormDate: e.target.value || null,
                      }))
                    }
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 sm:mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setErrors({});
                onOpenChange(false);
              }}
              className="h-9"
            >
              Batal
            </Button>
            <Button type="submit" className="h-9" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

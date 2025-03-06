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
    age: dog.age,
    color: dog.color,
    weight: dog.weight,
    sex: dog.sex,
    lastVaccineDate: dog.lastVaccineDate,
    lastDewormDate: dog.lastDewormDate,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <Label htmlFor="name">Nama</Label>
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
                    className="h-9"
                    required
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="breed">Ras</Label>
                  <Select
                    value={editForm.breedId || 'other'}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({
                        ...prev,
                        breedId: value === 'other' ? undefined : value,
                        customBreed: '',
                      }))
                    }
                  >
                    <SelectTrigger className="h-9">
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
                    <Label htmlFor="customBreed">Ras Lainnya</Label>
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
                      className="h-9"
                      required={!editForm.breedId}
                    />
                  </div>
                )}

                <div className="grid gap-1 sm:gap-2">
                  <Label>Tahun Lahir</Label>
                  <Select
                    value={
                      getCurrentYearMonth(editForm.age || 0).year || undefined
                    }
                    onValueChange={(value) => {
                      const currentMonth =
                        getCurrentYearMonth(editForm.age || 0).month || '01';
                      const age = calculateAge(value, currentMonth);
                      setEditForm((prev) => ({
                        ...prev,
                        age,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9">
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
                    value={
                      getCurrentYearMonth(editForm.age || 0).month || undefined
                    }
                    onValueChange={(value) => {
                      const currentYear =
                        getCurrentYearMonth(editForm.age || 0).year ||
                        new Date().getFullYear().toString();
                      const age = calculateAge(currentYear, value);
                      setEditForm((prev) => ({
                        ...prev,
                        age,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9">
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

              {/* Right column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="color">Warna</Label>
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
                    className="h-9"
                    required
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="weight">Berat (kg)</Label>
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
                    className="h-9"
                    required
                    min={0}
                  />
                </div>

                <div className="grid gap-1 sm:gap-2">
                  <Label htmlFor="sex">Jenis Kelamin</Label>
                  <Select
                    value={editForm.sex || ''}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({
                        ...prev,
                        sex: value as 'male' | 'female',
                      }))
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
                  <Label htmlFor="lastVaccineDate">
                    Tanggal Vaksin Terakhir
                  </Label>
                  <Input
                    id="lastVaccineDate"
                    type="date"
                    value={
                      editForm.lastVaccineDate
                        ? new Date(editForm.lastVaccineDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
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
                    value={
                      editForm.lastDewormDate
                        ? new Date(editForm.lastDewormDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
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

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
